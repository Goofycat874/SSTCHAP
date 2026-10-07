import { build } from "esbuild";
import fs from "fs";

const r = await build({
  entryPoints: ["src/App.jsx"], bundle: true, loader: { ".mp3": "dataurl" }, minify: true, format: "iife", write: false,
  jsx: "automatic", define: { "process.env.NODE_ENV": '"production"' }, target: "es2019", legalComments: "none",
});
const js = r.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");
const css = fs.readFileSync("src/styles.css", "utf8");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#181818">
<title>Inside the Vidhan Sabha</title>
<meta name="description" content="Interactive civics chapter: State Legislature, the three lists, Union vs State government, and challenges to legislatures.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400&display=swap">
<style>
[hidden]{display:none!important}img{max-width:100%}
${css}
</style>
</head>
<body>
<div id="root"></div>
<script>
${js}
</script>
</body>
</html>
`;
fs.rmSync("dist", { recursive: true, force: true });
fs.mkdirSync("dist", { recursive: true });
fs.writeFileSync("dist/index.html", html);
if (fs.existsSync("public")) fs.cpSync("public", "dist", { recursive: true });
console.log("Built dist/index.html (" + Math.round(html.length / 1024) + " KB)");
