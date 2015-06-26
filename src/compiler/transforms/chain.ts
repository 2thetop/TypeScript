/// <reference path="../factory.ts" />
/// <reference path="../transform.ts" />
/// <reference path="es7.ts" />
/// <reference path="es6.ts" />
/// <reference path="es5.ts" />
/// <reference path="es5generator.ts" />
namespace ts.transform {
    export function getTransformationChain(options: CompilerOptions): Transformation {
        if ((options.target || ScriptTarget.ES3) < ScriptTarget.ES6) {
            return chainTransformations(toES7, toES6, toES5);
        }
        
        return chainTransformations(toES7, toES6);
    }
    
    export function chainTransformations(...transformations: Transformation[]): Transformation {
        switch (transformations.length) {
            case 0: return identityTransformation;
            case 1: return createUnaryTransformationChain(transformations[0]);
            case 2: return createBinaryTransformationChain(transformations[0], transformations[1]);
            case 3: return createTrinaryTransformationChain(transformations[0], transformations[1], transformations[2]);
            default: return createNaryTransformationChain(transformations);
        }
    }
    
    function createUnaryTransformationChain(only: Transformation) {
        return function (resolver: TransformResolver, statements: NodeArray<Statement>) {
            if (only) statements = only(resolver, statements);
            return statements;
        };
    }
    
    function createBinaryTransformationChain(first: Transformation, second: Transformation) {
        return function (resolver: TransformResolver, statements: NodeArray<Statement>) {
            if (first) statements = first(resolver, statements);
            if (second) statements = second(resolver, statements);
            return statements;
        };
    }
    
    function createTrinaryTransformationChain(first: Transformation, second: Transformation, third: Transformation) {
        return function (resolver: TransformResolver, statements: NodeArray<Statement>) {
            if (first) statements = first(resolver, statements);
            if (second) statements = second(resolver, statements);
            if (third) statements = third(resolver, statements);
            return statements;
        };
    }
    
    function createNaryTransformationChain(transformations: Transformation[]) {
        return function (resolver: TransformResolver, statements: NodeArray<Statement>) {
            for (let transformation of transformations) {
                if (transformation) statements = transformation(resolver, statements);
            }
            return statements;
        };
    }
    
    function identityTransformation(resolver: TransformResolver, statements: NodeArray<Statement>): NodeArray<Statement> {
        return statements;
    }
}