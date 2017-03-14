#!/bin/bash

case "$(uname -s)" in
  Darwin)
    command -v gsed >/dev/null 2>&1 || { echo "I require gsed but it's not installed. Aborting." >&2; exit 0; }
    gsed 's/\(.*\)><\/s\(.*\)/\1 async><\/s\2/' < dist/index.html | gsed 's/\(.*\)<link\(.*\)/\1  <link\2/' | gsed 's/\(.*\)    <link\(.*\)/\1  <link\2/' | gsed 's/\(.*\)<\/head>\(.*\)/\1\n<\/head>\2/' | gsed -e 's:</script>:</script>\n:g' | gsed 's/\(.*\)<script\(.*\)/\1  <script\2/' > dist/index2.html;
    mv -f dist/index2.html dist/index.html
    ;;

  Linux)
    sed 's/\(.*\)><\/s\(.*\)/\1 async><\/s\2/' < dist/index.html | sed 's/\(.*\)<link\(.*\)/\1  <link\2/' | sed 's/\(.*\)    <link\(.*\)/\1  <link\2/' | sed 's/\(.*\)<\/head>\(.*\)/\1\n<\/head>\2/' | sed -e 's:</script>:</script>\n:g' | sed 's/\(.*\)<script\(.*\)/\1  <script\2/' > dist/index2.html;
    mv -f dist/index2.html dist/index.html
    ;;
esac