export const getLanguageVersion: Record<string, string> = {
  cpp: "10.2.0", // g++ 17 GCC 9.10
  java: "15.0.2", // JDK 11.0.4
  python3: "3.10.0", // 3.7.4
  go: "1.16.2", // 1.13.1
  "node-javascript": "16.3.0", // 12.11.1
  ruby: "3.0.1", // 2.6.5
  haskell: "9.0.1", // ghc 8.6.5
  rust: "1.50.0", // 1.38.0
  php: "8.0.2", // 7.3.10
};
export const getLanguage: Record<string, string> = {
  "text/x-c++src": "cpp",
  "text/x-java": "java",
  "text/javascript": "node-javascript",
  "text/x-python": "python3",
  "text/x-go": "go",
  "text/x-rustsrc": "rust",
  "text/x-ruby": "ruby",
  "text/x-php": "php",
  "text/x-haskell": "haskell",
};
