/// <reference path="types.ts"/>

/* @internal */
namespace ts {
    /**
     * Ternary values are defined such that
     * x & y is False if either x or y is False.
     * x & y is Maybe if either x or y is Maybe, but neither x or y is False.
     * x & y is True if both x and y are True.
     * x | y is False if both x and y are False.
     * x | y is Maybe if either x or y is Maybe, but neither x or y is True.
     * x | y is True if either x or y is True.
     */
    export const enum Ternary {
        False = 0,
        Maybe = 1,
        True = -1
    }

    export function createFileMap<T>(getCanonicalFileName: (fileName: string) => string): FileMap<T> {
        let files: Map<T> = {};
        return {
            get,
            set,
            contains,
            remove,
            forEachValue: forEachValueInMap
        }

        function set(fileName: string, value: T) {
            files[normalizeKey(fileName)] = value;
        }

        function get(fileName: string) {
            return files[normalizeKey(fileName)];
        }

        function contains(fileName: string) {
            return hasProperty(files, normalizeKey(fileName));
        }

        function remove (fileName: string) {
            let key = normalizeKey(fileName);
            delete files[key];
        }

        function forEachValueInMap(f: (value: T) => void) {
            forEachValue(files, f);
        }

        function normalizeKey(key: string) {
            return getCanonicalFileName(normalizeSlashes(key));
        }
    }

    export const enum Comparison {
        LessThan    = -1,
        EqualTo     = 0,
        GreaterThan = 1
    }

    export interface StringSet extends Map<any> { }

    /**
     * Iterates through 'array' by index and performs the callback on each element of array until the callback
     * returns a truthy value, then returns that value.
     * If no such value is found, the callback is applied to each element of array and undefined is returned.
     */
    export function forEach<T, U>(array: T[], callback: (element: T, index: number) => U): U {
        if (array) {
            for (let i = 0, len = array.length; i < len; i++) {
                let result = callback(array[i], i);
                if (result) {
                    return result;
                }
            }
        }
        return undefined;
    }

    export function contains<T>(array: T[], value: T): boolean {
        if (array) {
            for (let v of array) {
                if (v === value) {
                    return true;
                }
            }
        }
        return false;
    }

    export function indexOf<T>(array: T[], value: T): number {
        if (array) {
            for (let i = 0, len = array.length; i < len; i++) {
                if (array[i] === value) {
                    return i;
                }
            }
        }
        return -1;
    }

    export function countWhere<T>(array: T[], predicate: (x: T) => boolean): number {
        let count = 0;
        if (array) {
            for (let v of array) {
                if (predicate(v)) {
                    count++;
                }
            }
        }
        return count;
    }

    export function filter<T>(array: T[], f: (x: T) => boolean): T[]{
        let result: T[];
        if (array) {
            result = [];
            for (let item of array) {
                if (f(item)) {
                    result.push(item);
                }
            }
        }
        return result;
    }

    export function map<T, U>(array: T[], f: (x: T) => U): U[]{
        let result: U[];
        if (array) {
            result = [];
            for (let v of array) {
                result.push(f(v));
            }
        }
        return result;
    }

    export function concatenate<T>(array1: T[], array2: T[]): T[] {
        if (!array2 || !array2.length) return array1;
        if (!array1 || !array1.length) return array2;

        return array1.concat(array2);
    }

    export function deduplicate<T>(array: T[]): T[]{
        let result: T[];
        if (array) {
            result = [];
            for (let item of array) {
                if (!contains(result, item)) {
                    result.push(item);
                }
            }
        }
        return result;
    }

    export function sum(array: any[], prop: string): number {
        let result = 0;
        for (let v of array) {
            result += v[prop];
        }
        return result;
    }

    export function addRange<T>(to: T[], from: T[]): void {
        if (to && from) {
            for (let v of from) {
                to.push(v);
            }
        }
    } 

    export function rangeEquals<T>(array1: T[], array2: T[], pos: number, end: number) {
        while (pos < end) {
            if (array1[pos] !== array2[pos]) {
                return false;
            }
            pos++;
        }
        return true;
    }

    /**
     * Returns the last element of an array if non-empty, undefined otherwise.
     */
    export function lastOrUndefined<T>(array: T[]): T {
        if (array.length === 0) {
            return undefined;
        }

        return array[array.length - 1];
    }

    export function binarySearch(array: number[], value: number): number {
        let low = 0;
        let high = array.length - 1;

        while (low <= high) {
            let middle = low + ((high - low) >> 1);
            let midValue = array[middle];

            if (midValue === value) {
                return middle;
            }
            else if (midValue > value) {
                high = middle - 1;
            }
            else {
                low = middle + 1;
            }
        }

        return ~low;
    }

    export function reduceLeft<T>(array: T[], f: (a: T, x: T) => T): T;
    export function reduceLeft<T, U>(array: T[], f: (a: U, x: T) => U, initial: U): U;
    export function reduceLeft<T, U>(array: T[], f: (a: U, x: T) => U, initial?: U): U {
        if (array) {
            var count = array.length;
            if (count > 0) {
                var pos = 0;
                var result = arguments.length <= 2 ? array[pos++] : initial;
                while (pos < count) {
                    result = f(<U>result, array[pos++]);
                }
                return <U>result;
            }
        }
        return initial;
    }

    export function reduceRight<T>(array: T[], f: (a: T, x: T) => T): T;
    export function reduceRight<T, U>(array: T[], f: (a: U, x: T) => U, initial: U): U;
    export function reduceRight<T, U>(array: T[], f: (a: U, x: T) => U, initial?: U): U {
        if (array) {
            var pos = array.length - 1;
            if (pos >= 0) {
                var result = arguments.length <= 2 ? array[pos--] : initial;
                while (pos >= 0) {
                    result = f(<U>result, array[pos--]);
                }
                return <U>result;
            }
        }
        return initial;
    }

    let hasOwnProperty = Object.prototype.hasOwnProperty;

    export function hasProperty<T>(map: Map<T>, key: string): boolean {
        return hasOwnProperty.call(map, key);
    }

    export function getProperty<T>(map: Map<T>, key: string): T {
        return hasOwnProperty.call(map, key) ? map[key] : undefined;
    }

    export function isEmpty<T>(map: Map<T>) {
        for (let id in map) {
            if (hasProperty(map, id)) {
                return false;
            }
        }
        return true;
    }

    export function clone<T>(object: T): T {
        let result: any = {};
        for (let id in object) {
            result[id] = (<any>object)[id];
        }
        return <T>result;
    }

    export function extend<T>(first: Map<T>, second: Map<T>): Map<T> {
        let result: Map<T> = {};
        for (let id in first) {
            result[id] = first[id];
        }
        for (let id in second) {
            if (!hasProperty(result, id)) {
                result[id] = second[id];
            }
        }
        return result;
    }

    export function forEachValue<T, U>(map: Map<T>, callback: (value: T) => U): U {
        let result: U;
        for (let id in map) {
            if (result = callback(map[id])) break;
        }
        return result;
    }

    export function forEachKey<T, U>(map: Map<T>, callback: (key: string) => U): U {
        let result: U;
        for (let id in map) {
            if (result = callback(id)) break;
        }
        return result;
    }

    export function lookUp<T>(map: Map<T>, key: string): T {
        return hasProperty(map, key) ? map[key] : undefined;
    }

    export function copyMap<T>(source: Map<T>, target: Map<T>): void {
        for (let p in source) {
            target[p] = source[p];
        }
    }

    /**
     * Creates a map from the elements of an array.
     *
     * @param array the array of input elements.
     * @param makeKey a function that produces a key for a given element.
     *
     * This function makes no effort to avoid collisions; if any two elements produce
     * the same key with the given 'makeKey' function, then the element with the higher
     * index in the array will be the one associated with the produced key.
     */
    export function arrayToMap<T>(array: T[], makeKey: (value: T) => string): Map<T> {
        let result: Map<T> = {};

        forEach(array, value => {
            result[makeKey(value)] = value;
        });

        return result;
    }

    export function memoize<T>(callback: () => T): () => T {
        let value: T;
        return () => {
            if (callback) {
                value = callback();
                callback = undefined;
            }
            return value;
        };
    }

    function formatStringFromArgs(text: string, args: { [index: number]: any; }, baseIndex?: number): string {
        baseIndex = baseIndex || 0;

        return text.replace(/{(\d+)}/g, (match, index?) => args[+index + baseIndex]);
    }

    export let localizedDiagnosticMessages: Map<string> = undefined;

    export function getLocaleSpecificMessage(message: string) {
        return localizedDiagnosticMessages && localizedDiagnosticMessages[message]
            ? localizedDiagnosticMessages[message]
            : message;
    }

    export function createFileDiagnostic(file: SourceFile, start: number, length: number, message: DiagnosticMessage, ...args: any[]): Diagnostic;
    export function createFileDiagnostic(file: SourceFile, start: number, length: number, message: DiagnosticMessage): Diagnostic {
        let end = start + length;

        Debug.assert(start >= 0, "start must be non-negative, is " + start);
        Debug.assert(length >= 0, "length must be non-negative, is " + length);

        if (file) {
            Debug.assert(start <= file.text.length, `start must be within the bounds of the file. ${ start } > ${ file.text.length }`);
            Debug.assert(end <= file.text.length, `end must be the bounds of the file. ${ end } > ${ file.text.length }`);
        }

        let text = getLocaleSpecificMessage(message.key);
        
        if (arguments.length > 4) {
            text = formatStringFromArgs(text, arguments, 4);
        }

        return {
            file,
            start,
            length,

            messageText: text,
            category: message.category,
            code: message.code,
        };
    }

    export function createCompilerDiagnostic(message: DiagnosticMessage, ...args: any[]): Diagnostic;
    export function createCompilerDiagnostic(message: DiagnosticMessage): Diagnostic {
        let text = getLocaleSpecificMessage(message.key);

        if (arguments.length > 1) {
            text = formatStringFromArgs(text, arguments, 1);
        }

        return {
            file: undefined,
            start: undefined,
            length: undefined,

            messageText: text,
            category: message.category,
            code: message.code
        };
    }

    export function chainDiagnosticMessages(details: DiagnosticMessageChain, message: DiagnosticMessage, ...args: any[]): DiagnosticMessageChain;
    export function chainDiagnosticMessages(details: DiagnosticMessageChain, message: DiagnosticMessage): DiagnosticMessageChain {
        let text = getLocaleSpecificMessage(message.key);

        if (arguments.length > 2) {
            text = formatStringFromArgs(text, arguments, 2);
        }

        return {
            messageText: text,
            category: message.category,
            code: message.code,

            next: details
        };
    }

    export function concatenateDiagnosticMessageChains(headChain: DiagnosticMessageChain, tailChain: DiagnosticMessageChain): DiagnosticMessageChain {
        Debug.assert(!headChain.next);
        headChain.next = tailChain;
        return headChain;
    }

    export function compareValues<T>(a: T, b: T): Comparison {
        if (a === b) return Comparison.EqualTo;
        if (a === undefined) return Comparison.LessThan;
        if (b === undefined) return Comparison.GreaterThan;
        return a < b ? Comparison.LessThan : Comparison.GreaterThan;
    }

    function getDiagnosticFileName(diagnostic: Diagnostic): string {
        return diagnostic.file ? diagnostic.file.fileName : undefined;
    }

    export function compareDiagnostics(d1: Diagnostic, d2: Diagnostic): Comparison {
        return compareValues(getDiagnosticFileName(d1), getDiagnosticFileName(d2)) ||
            compareValues(d1.start, d2.start) ||
            compareValues(d1.length, d2.length) ||
            compareValues(d1.code, d2.code) ||
            compareMessageText(d1.messageText, d2.messageText) ||
            Comparison.EqualTo;
    }

    function compareMessageText(text1: string | DiagnosticMessageChain, text2: string | DiagnosticMessageChain): Comparison {
        while (text1 && text2) {
            // We still have both chains.
            let string1 = typeof text1 === "string" ? text1 : text1.messageText;
            let string2 = typeof text2 === "string" ? text2 : text2.messageText;

            let res = compareValues(string1, string2);
            if (res) {
                return res;
            }

            text1 = typeof text1 === "string" ? undefined : text1.next;
            text2 = typeof text2 === "string" ? undefined : text2.next;
        }

        if (!text1 && !text2) {
            // if the chains are done, then these messages are the same.
            return Comparison.EqualTo;
        }

        // We still have one chain remaining.  The shorter chain should come first.
        return text1 ? Comparison.GreaterThan : Comparison.LessThan;
    }

    export function sortAndDeduplicateDiagnostics(diagnostics: Diagnostic[]): Diagnostic[]{
        return deduplicateSortedDiagnostics(diagnostics.sort(compareDiagnostics));
    }

    export function deduplicateSortedDiagnostics(diagnostics: Diagnostic[]): Diagnostic[] {
        if (diagnostics.length < 2) {
            return diagnostics;
        }

        let newDiagnostics = [diagnostics[0]];
        let previousDiagnostic = diagnostics[0];
        for (let i = 1; i < diagnostics.length; i++) {
            let currentDiagnostic = diagnostics[i];
            let isDupe = compareDiagnostics(currentDiagnostic, previousDiagnostic) === Comparison.EqualTo;
            if (!isDupe) {
                newDiagnostics.push(currentDiagnostic);
                previousDiagnostic = currentDiagnostic;
            }
        }

        return newDiagnostics;
    }

    export function normalizeSlashes(path: string): string {
        return path.replace(/\\/g, "/");
    }

    // Returns length of path root (i.e. length of "/", "x:/", "//server/share/, file:///user/files")
    export function getRootLength(path: string): number {
        if (path.charCodeAt(0) === CharacterCodes.slash) {
            if (path.charCodeAt(1) !== CharacterCodes.slash) return 1;
            let p1 = path.indexOf("/", 2);
            if (p1 < 0) return 2;
            let p2 = path.indexOf("/", p1 + 1);
            if (p2 < 0) return p1 + 1;
            return p2 + 1;
        }
        if (path.charCodeAt(1) === CharacterCodes.colon) {
            if (path.charCodeAt(2) === CharacterCodes.slash) return 3;
            return 2;
        }
        // Per RFC 1738 'file' URI schema has the shape file://<host>/<path>
        // if <host> is omitted then it is assumed that host value is 'localhost',
        // however slash after the omitted <host> is not removed.
        // file:///folder1/file1 - this is a correct URI
        // file://folder2/file2 - this is an incorrect URI
        if (path.lastIndexOf("file:///", 0) === 0) {
            return "file:///".length;
        }
        let idx = path.indexOf('://');
        if (idx !== -1) {
            return idx + "://".length;
        }
        return 0;
    }

    export let directorySeparator = "/";
    function getNormalizedParts(normalizedSlashedPath: string, rootLength: number) {
        let parts = normalizedSlashedPath.substr(rootLength).split(directorySeparator);
        let normalized: string[] = [];
        for (let part of parts) {
            if (part !== ".") {
                if (part === ".." && normalized.length > 0 && lastOrUndefined(normalized) !== "..") {
                    normalized.pop();
                }
                else {
                    // A part may be an empty string (which is 'falsy') if the path had consecutive slashes,
                    // e.g. "path//file.ts".  Drop these before re-joining the parts.
                    if(part) {
                        normalized.push(part);
                    }
                }
            }
        }

        return normalized;
    }

    export function normalizePath(path: string): string {
        path = normalizeSlashes(path);
        let rootLength = getRootLength(path);
        let normalized = getNormalizedParts(path, rootLength);
        return path.substr(0, rootLength) + normalized.join(directorySeparator);
    }

    export function getDirectoryPath(path: string) {
        return path.substr(0, Math.max(getRootLength(path), path.lastIndexOf(directorySeparator)));
    }

    export function isUrl(path: string) {
        return path && !isRootedDiskPath(path) && path.indexOf("://") !== -1;
    }

    export function isRootedDiskPath(path: string) {
        return getRootLength(path) !== 0;
    }

    function normalizedPathComponents(path: string, rootLength: number) {
        let normalizedParts = getNormalizedParts(path, rootLength);
        return [path.substr(0, rootLength)].concat(normalizedParts);
    }

    export function getNormalizedPathComponents(path: string, currentDirectory: string) {
        path = normalizeSlashes(path);
        let rootLength = getRootLength(path);
        if (rootLength === 0) {
            // If the path is not rooted it is relative to current directory
            path = combinePaths(normalizeSlashes(currentDirectory), path);
            rootLength = getRootLength(path);
        }

        return normalizedPathComponents(path, rootLength);
    }

    export function getNormalizedAbsolutePath(fileName: string, currentDirectory: string) {
        return getNormalizedPathFromPathComponents(getNormalizedPathComponents(fileName, currentDirectory));
    }

    export function getNormalizedPathFromPathComponents(pathComponents: string[]) {
        if (pathComponents && pathComponents.length) {
            return pathComponents[0] + pathComponents.slice(1).join(directorySeparator);
        }
    }

    function getNormalizedPathComponentsOfUrl(url: string) {
        // Get root length of http://www.website.com/folder1/foler2/
        // In this example the root is:  http://www.website.com/ 
        // normalized path components should be ["http://www.website.com/", "folder1", "folder2"]

        let urlLength = url.length;
        // Initial root length is http:// part
        let rootLength = url.indexOf("://") + "://".length;
        while (rootLength < urlLength) {
            // Consume all immediate slashes in the protocol 
            // eg.initial rootlength is just file:// but it needs to consume another "/" in file:///
            if (url.charCodeAt(rootLength) === CharacterCodes.slash) {
                rootLength++;
            }
            else {
                // non slash character means we continue proceeding to next component of root search 
                break;
            }
        }

        // there are no parts after http:// just return current string as the pathComponent
        if (rootLength === urlLength) {
            return [url];
        }

        // Find the index of "/" after website.com so the root can be http://www.website.com/ (from existing http://)
        let indexOfNextSlash = url.indexOf(directorySeparator, rootLength);
        if (indexOfNextSlash !== -1) {
            // Found the "/" after the website.com so the root is length of http://www.website.com/ 
            // and get components afetr the root normally like any other folder components
            rootLength = indexOfNextSlash + 1;
            return normalizedPathComponents(url, rootLength);
        }
        else {
            // Can't find the host assume the rest of the string as component 
            // but make sure we append "/"  to it as root is not joined using "/"
            // eg. if url passed in was http://website.com we want to use root as [http://website.com/] 
            // so that other path manipulations will be correct and it can be merged with relative paths correctly
            return [url + directorySeparator];
        }
    }

    function getNormalizedPathOrUrlComponents(pathOrUrl: string, currentDirectory: string) {
        if (isUrl(pathOrUrl)) {
            return getNormalizedPathComponentsOfUrl(pathOrUrl);
        }
        else {
            return getNormalizedPathComponents(pathOrUrl, currentDirectory);
        }
    }

    export function getRelativePathToDirectoryOrUrl(directoryPathOrUrl: string, relativeOrAbsolutePath: string, currentDirectory: string, getCanonicalFileName: (fileName: string) => string, isAbsolutePathAnUrl: boolean) {
        let pathComponents = getNormalizedPathOrUrlComponents(relativeOrAbsolutePath, currentDirectory);
        let directoryComponents = getNormalizedPathOrUrlComponents(directoryPathOrUrl, currentDirectory);
        if (directoryComponents.length > 1 && lastOrUndefined(directoryComponents) === "") {
            // If the directory path given was of type test/cases/ then we really need components of directory to be only till its name
            // that is  ["test", "cases", ""] needs to be actually ["test", "cases"]
            directoryComponents.length--;
        }

        // Find the component that differs
        for (var joinStartIndex = 0; joinStartIndex < pathComponents.length && joinStartIndex < directoryComponents.length; joinStartIndex++) {
            if (getCanonicalFileName(directoryComponents[joinStartIndex]) !== getCanonicalFileName(pathComponents[joinStartIndex])) {
                break;
            }
        }

        // Get the relative path
        if (joinStartIndex) {
            let relativePath = "";
            let relativePathComponents = pathComponents.slice(joinStartIndex, pathComponents.length);
            for (; joinStartIndex < directoryComponents.length; joinStartIndex++) {
                if (directoryComponents[joinStartIndex] !== "") {
                    relativePath = relativePath + ".." + directorySeparator;
                }
            }

            return relativePath + relativePathComponents.join(directorySeparator);
        }

        // Cant find the relative path, get the absolute path
        let absolutePath = getNormalizedPathFromPathComponents(pathComponents);
        if (isAbsolutePathAnUrl && isRootedDiskPath(absolutePath)) {
            absolutePath = "file:///" + absolutePath;
        }

        return absolutePath;
    }

    export function getBaseFileName(path: string) {
        let i = path.lastIndexOf(directorySeparator);
        return i < 0 ? path : path.substring(i + 1);
    }

    export function combinePaths(path1: string, path2: string) {
        if (!(path1 && path1.length)) return path2;
        if (!(path2 && path2.length)) return path1;
        if (getRootLength(path2) !== 0) return path2;
        if (path1.charAt(path1.length - 1) === directorySeparator) return path1 + path2;
        return path1 + directorySeparator + path2;
    }

    export function fileExtensionIs(path: string, extension: string): boolean {
        let pathLen = path.length;
        let extLen = extension.length;
        return pathLen > extLen && path.substr(pathLen - extLen, extLen) === extension;
    }

    /**
     *  List of supported extensions in order of file resolution precedence.
     */
    export const supportedExtensions = [".tsx", ".ts", ".d.ts"];

    const extensionsToRemove = [".d.ts", ".ts", ".js", ".tsx", ".jsx"];
    export function removeFileExtension(path: string): string {
        for (let ext of extensionsToRemove) {
            if (fileExtensionIs(path, ext)) {
                return path.substr(0, path.length - ext.length);
            }
        }
        return path;
    }

    let backslashOrDoubleQuote = /[\"\\]/g;
    let escapedCharsRegExp = /[\u0000-\u001f\t\v\f\b\r\n\u2028\u2029\u0085]/g;
    let escapedCharsMap: Map<string> = {
        "\0": "\\0",
        "\t": "\\t",
        "\v": "\\v",
        "\f": "\\f",
        "\b": "\\b",
        "\r": "\\r",
        "\n": "\\n",
        "\\": "\\\\",
        "\"": "\\\"",
        "\u2028": "\\u2028", // lineSeparator
        "\u2029": "\\u2029", // paragraphSeparator
        "\u0085": "\\u0085"  // nextLine
    };

    export interface ObjectAllocator {
        getNodeConstructor(kind: SyntaxKind): new () => Node;
        getSymbolConstructor(): new (flags: SymbolFlags, name: string) => Symbol;
        getTypeConstructor(): new (checker: TypeChecker, flags: TypeFlags) => Type;
        getSignatureConstructor(): new (checker: TypeChecker) => Signature;
    }

    function Symbol(flags: SymbolFlags, name: string) {
        this.flags = flags;
        this.name = name;
        this.declarations = undefined;
    }

    function Type(checker: TypeChecker, flags: TypeFlags) {
        this.flags = flags;
    }

    function Signature(checker: TypeChecker) {
    }

    export let objectAllocator: ObjectAllocator = {
        getNodeConstructor: kind => {
            function Node() {
            }
            Node.prototype = {
                kind: kind,
                pos: -1,
                end: -1,
                flags: 0,
                parent: undefined,
            };
            return <any>Node;
        },
        getSymbolConstructor: () => <any>Symbol,
        getTypeConstructor: () => <any>Type,
        getSignatureConstructor: () => <any>Signature
    }

    export const enum AssertionLevel {
        None = 0,
        Normal = 1,
        Aggressive = 2,
        VeryAggressive = 3,
    }

    export module Debug {
        let currentAssertionLevel = AssertionLevel.None;

        export function shouldAssert(level: AssertionLevel): boolean {
            return currentAssertionLevel >= level;
        }

        export function assert(expression: boolean, message?: string, verboseDebugInfo?: () => string): void {
            if (!expression) {
                let verboseDebugString = "";
                if (verboseDebugInfo) {
                    verboseDebugString = "\r\nVerbose Debug Information: " + verboseDebugInfo();
                }

                throw new Error("Debug Failure. False expression: " + (message || "") + verboseDebugString);
            }
        }

        export function fail(message?: string): void {
            Debug.assert(false, message);
        }
    }
}
