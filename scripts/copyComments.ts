import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

/**
 * Extracts JSDoc comments from source files and maps them to method signatures.
 */
function extractJSDocComments(sourceFile: ts.SourceFile): Map<string, string> {
    const commentMap = new Map<string, string>();

    // Helper function to get the JSDoc comment for a node
    function getJSDocComment(node: ts.Node): string | undefined {
        const nodePos = node.getFullStart();
        const commentRanges = ts.getLeadingCommentRanges(sourceFile.text, nodePos);

        if (!commentRanges || commentRanges.length === 0) {
            return undefined;
        }

        // Get the last comment before the node (which should be the JSDoc)
        const commentRange = commentRanges[commentRanges.length - 1];
        return sourceFile.text.substring(commentRange.pos, commentRange.end);
    }

    // Visit each node in the source file
    function visit(node: ts.Node) {
        // Look for method declarations
        if (ts.isMethodDeclaration(node) && node.name) {
            const methodName = node.name.getText(sourceFile);
            //const parameters = node.parameters.map(p => p.getText(sourceFile)).join(', ');
            //const signature = `${methodName}(${parameters})`;

            const jsDocComment = getJSDocComment(node);
            if (jsDocComment) {
                commentMap.set(methodName, jsDocComment);
            }
        }

        // Continue traversing the AST
        ts.forEachChild(node, visit);
    }

    visit(sourceFile);
    return commentMap;
}

/**
 * Applies JSDoc comments from source to target file.
 */
function applyComments(sourcePath: string, targetPath: string): void {
    // Read the source files
    const sourceCode = fs.readFileSync(sourcePath, 'utf8');
    const targetCode = fs.readFileSync(targetPath, 'utf8');

    // Parse the source files
    const sourceFile = ts.createSourceFile(
        path.basename(sourcePath),
        sourceCode,
        ts.ScriptTarget.Latest,
        true
    );

    const targetFile = ts.createSourceFile(
        path.basename(targetPath),
        targetCode,
        ts.ScriptTarget.Latest,
        true
    );

    // Extract comments from source
    const commentMap = extractJSDocComments(sourceFile);

    // Find methods in target that need comments
    let updatedTargetCode = targetCode;
    let offset = 0;

    function processTargetNode(node: ts.Node) {
        if (ts.isMethodDeclaration(node) && node.name) {
            const methodName = node.name.getText(targetFile);
            const sourceComment = commentMap.get(methodName);

            if (sourceComment) {
                // Check if the method already has a comment
                const existingComment = getJSDocComment(node);
                if (!existingComment) {
                    // Insert the comment before the method
                    const insertPos = node.getFullStart() + offset;
                    const indentation = getIndentation(targetCode, insertPos);

                    // Format the comment with proper indentation
                    const formattedComment = sourceComment
                        .split('\n')
                        .map(line => line ? `${indentation}${line}` : indentation)
                        .join('\n');

                    updatedTargetCode =
                        updatedTargetCode.substring(0, insertPos) +
                        formattedComment + '\n' +
                        updatedTargetCode.substring(insertPos);

                    offset += formattedComment.length + 1;
                }
            }
        }

        // Continue traversing
        ts.forEachChild(node, processTargetNode);
    }

    // Helper to get proper indentation
    function getIndentation(code: string, position: number): string {
        let i = position - 1;
        let indent = '';
        while (i >= 0 && code[i] !== '\n') {
            i--;
        }
        i++;
        while (i < position && (code[i] === ' ' || code[i] === '\t')) {
            indent += code[i];
            i++;
        }
        return indent;
    }

    // Helper to get JSDoc comment for a node
    function getJSDocComment(node: ts.Node): string | undefined {
        const nodePos = node.getFullStart();
        const commentRanges = ts.getLeadingCommentRanges(targetFile.text, nodePos);

        if (!commentRanges || commentRanges.length === 0) {
            return undefined;
        }

        return targetFile.text.substring(commentRanges[commentRanges.length - 1].pos, commentRanges[commentRanges.length - 1].end);
    }

    // Process the target file
    processTargetNode(targetFile);

    // Write the updated code back to the target file
    fs.writeFileSync(targetPath, updatedTargetCode);

    console.log(`Comments copied from ${path.basename(sourcePath)} to ${path.basename(targetPath)}`);
}

// Execute the script
const sourceFile = path.resolve(__dirname, '../src/MegotaNumber.ts');
const targetFile = path.resolve(__dirname, '../src/Megota.ts');

applyComments(sourceFile, targetFile);