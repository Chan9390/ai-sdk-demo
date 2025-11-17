"use client";

import {
  Artifact,
  ArtifactAction,
  ArtifactActions,
  ArtifactContent,
  ArtifactDescription,
  ArtifactHeader,
  ArtifactTitle,
} from "@/components/ai-elements/artifact";
import { CodeBlock } from "@/components/ai-elements/code-block";
import {
  CopyIcon,
  DownloadIcon,
  PlayIcon,
  RefreshCwIcon,
  ShareIcon,
} from "lucide-react";

const pythonCode = `# Fibonacci sequence generator
def fibonacci(n):
    """
    Generate Fibonacci sequence up to n terms
    """
    sequence = []
    a, b = 0, 1

    for _ in range(n):
        sequence.append(a)
        a, b = b, a + b

    return sequence

# Generate first 10 Fibonacci numbers
result = fibonacci(10)
print(f"First 10 Fibonacci numbers: {result}")

# Calculate sum of the sequence
total = sum(result)
print(f"Sum of sequence: {total}")`;

const javascriptCode = `// Async data fetcher with error handling
async function fetchUserData(userId) {
  const API_URL = 'https://api.example.com';

  try {
    const response = await fetch(\`\${API_URL}/users/\${userId}\`);

    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }

    const data = await response.json();
    return {
      success: true,
      user: data
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Usage example
fetchUserData(123).then(result => {
  if (result.success) {
    console.log('User data:', result.user);
  } else {
    console.log('Failed to fetch user:', result.error);
  }
});`;

const htmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hello World</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
      transition: background 0.5s ease;
    }

    .container {
      background: white;
      padding: 40px;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      text-align: center;
      max-width: 500px;
      width: 100%;
    }

    h1 {
      color: #333;
      font-size: 2.5em;
      margin-bottom: 20px;
      animation: fadeInDown 1s ease-out;
    }

    p {
      color: #666;
      font-size: 1.1em;
      margin-bottom: 30px;
    }

    button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 15px 40px;
      font-size: 1.1em;
      border-radius: 50px;
      cursor: pointer;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      font-weight: bold;
    }

    button:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
    }

    button:active {
      transform: translateY(-1px);
    }

    .message {
      margin-top: 20px;
      font-size: 1.2em;
      color: #667eea;
      font-weight: bold;
      min-height: 30px;
    }

    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Hello World!</h1>
    <p>Welcome to my interactive HTML page</p>
    <button onclick="changeBackground()">Click Me!</button>
    <div id="message" class="message"></div>
  </div>

  <script>
    let clickCount = 0;

    const colors = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    ];

    function changeBackground() {
      clickCount++;
      const messageEl = document.getElementById('message');
      const messages = [
        '🎉 Awesome! You clicked the button!',
        '⭐ Great job! Click again!',
        '🚀 You\\'re on fire!',
        '💫 Amazing! Keep going!',
        '🎊 Fantastic! One more time!',
        '🌟 Incredible! You\\'re a clicking master!'
      ];

      // Change background color randomly
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      document.body.style.background = randomColor;

      // Show message
      const messageIndex = Math.min(clickCount - 1, messages.length - 1);
      messageEl.textContent = messages[messageIndex];
    }
  </script>
</body>
</html>`;

export default function ArtifactsPage() {
  return (
    <div className="container mx-auto max-w-4xl p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Artifact Examples</h1>
        <p className="text-muted-foreground">
          Code snippets using the AI Element Artifact component
        </p>
      </div>

      {/* Python Example */}
      <Artifact>
        <ArtifactHeader>
          <div>
            <ArtifactTitle>Fibonacci Sequence Generator</ArtifactTitle>
            <ArtifactDescription>Python implementation</ArtifactDescription>
          </div>
          <div className="flex items-center gap-2">
            <ArtifactActions>
              <ArtifactAction
                icon={PlayIcon}
                label="Run"
                onClick={() => console.log("Run Python code")}
                tooltip="Run code"
              />
              <ArtifactAction
                icon={CopyIcon}
                label="Copy"
                onClick={() => console.log("Copy code")}
                tooltip="Copy to clipboard"
              />
              <ArtifactAction
                icon={RefreshCwIcon}
                label="Regenerate"
                onClick={() => console.log("Regenerate")}
                tooltip="Regenerate content"
              />
              <ArtifactAction
                icon={DownloadIcon}
                label="Download"
                onClick={() => console.log("Download")}
                tooltip="Download file"
              />
              <ArtifactAction
                icon={ShareIcon}
                label="Share"
                onClick={() => console.log("Share")}
                tooltip="Share artifact"
              />
            </ArtifactActions>
          </div>
        </ArtifactHeader>
        <ArtifactContent className="p-0">
          <CodeBlock
            className="border-none"
            code={pythonCode}
            language="python"
            showLineNumbers
          />
        </ArtifactContent>
      </Artifact>

      {/* JavaScript Example */}
      <Artifact>
        <ArtifactHeader>
          <div>
            <ArtifactTitle>Async User Data Fetcher</ArtifactTitle>
            <ArtifactDescription>JavaScript implementation</ArtifactDescription>
          </div>
          <div className="flex items-center gap-2">
            <ArtifactActions>
              <ArtifactAction
                icon={PlayIcon}
                label="Run"
                onClick={() => console.log("Run JavaScript code")}
                tooltip="Run code"
              />
              <ArtifactAction
                icon={CopyIcon}
                label="Copy"
                onClick={() => console.log("Copy code")}
                tooltip="Copy to clipboard"
              />
              <ArtifactAction
                icon={RefreshCwIcon}
                label="Regenerate"
                onClick={() => console.log("Regenerate")}
                tooltip="Regenerate content"
              />
              <ArtifactAction
                icon={DownloadIcon}
                label="Download"
                onClick={() => console.log("Download")}
                tooltip="Download file"
              />
              <ArtifactAction
                icon={ShareIcon}
                label="Share"
                onClick={() => console.log("Share")}
                tooltip="Share artifact"
              />
            </ArtifactActions>
          </div>
        </ArtifactHeader>
        <ArtifactContent className="p-0">
          <CodeBlock
            className="border-none"
            code={javascriptCode}
            language="javascript"
            showLineNumbers
          />
        </ArtifactContent>
      </Artifact>

      {/* HTML Rendered Example */}
      <Artifact>
        <ArtifactHeader>
          <div>
            <ArtifactTitle>Interactive Hello World</ArtifactTitle>
            <ArtifactDescription>
              Complete HTML document with random background colors
            </ArtifactDescription>
          </div>
          <div className="flex items-center gap-2">
            <ArtifactActions>
              <ArtifactAction
                icon={RefreshCwIcon}
                label="Regenerate"
                onClick={() => console.log("Regenerate")}
                tooltip="Regenerate content"
              />
              <ArtifactAction
                icon={DownloadIcon}
                label="Download"
                onClick={() => {
                  const blob = new Blob([htmlCode], { type: "text/html" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "hello-world.html";
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
                tooltip="Download HTML file"
              />
              <ArtifactAction
                icon={ShareIcon}
                label="Share"
                onClick={() => console.log("Share")}
                tooltip="Share artifact"
              />
            </ArtifactActions>
          </div>
        </ArtifactHeader>
        <ArtifactContent className="p-0">
          <iframe
            srcDoc={htmlCode}
            title="Interactive Hello World"
            className="w-full h-[500px] border-none"
            sandbox="allow-scripts allow-modals"
          />
        </ArtifactContent>
      </Artifact>

      {/* PDF Example */}
      <Artifact>
        <ArtifactHeader>
          <div>
            <ArtifactTitle>Sample PDF Document</ArtifactTitle>
            <ArtifactDescription>
              Embedded PDF viewer artifact
            </ArtifactDescription>
          </div>
          <div className="flex items-center gap-2">
            <ArtifactActions>
              <ArtifactAction
                icon={DownloadIcon}
                label="Download"
                onClick={() => {
                  const a = document.createElement("a");
                  a.href = "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf";
                  a.download = "sample-document.pdf";
                  a.target = "_blank";
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }}
                tooltip="Download PDF"
              />
              <ArtifactAction
                icon={ShareIcon}
                label="Share"
                onClick={() => console.log("Share")}
                tooltip="Share artifact"
              />
            </ArtifactActions>
          </div>
        </ArtifactHeader>
        <ArtifactContent className="p-0">
          <embed
            src="https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf#toolbar=0&navpanes=0&scrollbar=1&view=FitH"
            type="application/pdf"
            className="w-full h-[600px]"
          />
        </ArtifactContent>
      </Artifact>
    </div>
  );
}
