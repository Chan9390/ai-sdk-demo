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

const terraformCode = `# Configure AWS Provider
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# Create VPC
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "demo-vpc"
  }
}

# Create Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "demo-igw"
  }
}

# Create Public Subnet
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = true

  tags = {
    Name = "demo-public-subnet"
  }
}

# Create Route Table
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name = "demo-public-rt"
  }
}

# Associate Route Table with Subnet
resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

# Create Security Group
resource "aws_security_group" "web" {
  name        = "web-sg"
  description = "Allow HTTP and SSH traffic"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "web-security-group"
  }
}

# Create EC2 Instance
resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0" # Amazon Linux 2
  instance_type = "t2.micro"
  subnet_id     = aws_subnet.public.id

  vpc_security_group_ids = [aws_security_group.web.id]

  user_data = <<-EOF
              #!/bin/bash
              yum update -y
              yum install -y httpd
              systemctl start httpd
              systemctl enable httpd
              echo "<h1>Hello from Terraform!</h1>" > /var/www/html/index.html
              EOF

  tags = {
    Name = "demo-web-server"
  }
}

# Output the public IP
output "instance_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_instance.web.public_ip
}

output "instance_public_dns" {
  description = "Public DNS of the EC2 instance"
  value       = aws_instance.web.public_dns
}`;

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

      {/* Terraform Example */}
      <Artifact>
        <ArtifactHeader>
          <div>
            <ArtifactTitle>AWS EC2 Web Server</ArtifactTitle>
            <ArtifactDescription>Terraform infrastructure as code</ArtifactDescription>
          </div>
          <div className="flex items-center gap-2">
            <ArtifactActions>
              <ArtifactAction
                icon={PlayIcon}
                label="Run"
                onClick={() => console.log("Run Terraform")}
                tooltip="Run terraform apply"
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
                onClick={() => {
                  const blob = new Blob([terraformCode], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "main.tf";
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
                tooltip="Download Terraform file"
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
            code={terraformCode}
            language="hcl"
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
