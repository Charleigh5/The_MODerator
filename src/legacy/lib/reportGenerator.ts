import type { ParsedDocument } from "./documentProcessor";
import { MODS } from "../data/modLibrary";

export function generateModReport(doc: ParsedDocument): string {
  const timestamp = new Date().toLocaleString();
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mod Creation Report - ${doc.title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #001830 0%, #00274c 100%);
      color: #f2efe4;
      padding: 40px 20px;
      line-height: 1.6;
    }
    .container { max-width: 1200px; margin: 0 auto; }
    .header {
      background: linear-gradient(135deg, #ffcb05 0%, #e3b400 100%);
      color: #001830;
      padding: 40px;
      border-radius: 12px;
      margin-bottom: 40px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    }
    .header h1 { font-size: 2.5em; margin-bottom: 10px; }
    .header .meta { font-size: 0.9em; opacity: 0.8; }
    .section {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,203,5,0.2);
      border-radius: 12px;
      padding: 30px;
      margin-bottom: 30px;
      backdrop-filter: blur(10px);
    }
    .section h2 {
      color: #ffcb05;
      font-size: 1.8em;
      margin-bottom: 20px;
      border-bottom: 2px solid rgba(255,203,5,0.3);
      padding-bottom: 10px;
    }
    .section h3 {
      color: #ffd94f;
      font-size: 1.3em;
      margin: 20px 0 10px 0;
    }
    .flow-chart {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin: 30px 0;
    }
    .flow-node {
      background: rgba(255,203,5,0.1);
      border: 2px solid #ffcb05;
      border-radius: 8px;
      padding: 20px;
      position: relative;
    }
    .flow-node::after {
      content: '↓';
      position: absolute;
      bottom: -25px;
      left: 50%;
      transform: translateX(-50%);
      color: #ffcb05;
      font-size: 2em;
    }
    .flow-node:last-child::after { display: none; }
    .flow-node h4 { color: #ffcb05; margin-bottom: 10px; }
    .feature-card {
      background: rgba(0,0,0,0.3);
      border-left: 4px solid #ffcb05;
      padding: 20px;
      margin: 20px 0;
      border-radius: 0 8px 8px 0;
    }
    .feature-card h4 {
      color: #ffcb05;
      font-size: 1.4em;
      margin-bottom: 15px;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.85em;
      font-weight: 600;
      margin: 5px 5px 5px 0;
    }
    .badge-extend { background: #2f6b41; color: #b6f29b; }
    .badge-rewrite { background: #8a6d1f; color: #ffd94f; }
    .badge-new { background: #a92e1f; color: #ff9b8a; }
    .badge-source { background: #14487e; color: #8fd9ff; }
    ul { margin: 10px 0 10px 20px; }
    li { margin: 8px 0; }
    .story {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,203,5,0.15);
      border-radius: 8px;
      padding: 15px;
      margin: 15px 0;
    }
    .story-title { color: #ffd94f; font-weight: 600; margin-bottom: 8px; }
    .story-text { font-size: 0.95em; color: #c8c4b8; }
    .source-card {
      background: rgba(20,72,126,0.2);
      border: 1px solid rgba(143,217,255,0.3);
      border-radius: 8px;
      padding: 15px;
      margin: 10px 0;
    }
    .source-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    .source-name { color: #8fd9ff; font-weight: 600; font-size: 1.1em; }
    .source-platform { color: #6fa3d8; font-size: 0.9em; }
    .reasoning {
      background: rgba(255,203,5,0.05);
      border-left: 3px solid #ffcb05;
      padding: 15px;
      margin: 15px 0;
      font-style: italic;
      color: #e8e4d8;
    }
    .suggestion {
      background: rgba(47,107,65,0.2);
      border-left: 3px solid #2f6b41;
      padding: 12px 15px;
      margin: 10px 0;
      border-radius: 0 8px 8px 0;
    }
    .suggestion::before {
      content: '💡 ';
      margin-right: 8px;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin: 20px 0;
    }
    .stat-card {
      background: rgba(255,203,5,0.1);
      border: 1px solid rgba(255,203,5,0.3);
      border-radius: 8px;
      padding: 20px;
      text-align: center;
    }
    .stat-value {
      font-size: 2.5em;
      font-weight: 700;
      color: #ffcb05;
      margin-bottom: 5px;
    }
    .stat-label {
      font-size: 0.9em;
      color: #c8c4b8;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .not-list {
      background: rgba(169,46,31,0.1);
      border-left: 3px solid #a92e1f;
      padding: 15px;
      margin: 15px 0;
      border-radius: 0 8px 8px 0;
    }
    .not-list h5 { color: #ff9b8a; margin-bottom: 10px; }
    .test-plan {
      background: rgba(47,107,65,0.1);
      border-left: 3px solid #2f6b41;
      padding: 15px;
      margin: 15px 0;
      border-radius: 0 8px 8px 0;
    }
    .test-plan h5 { color: #b6f29b; margin-bottom: 10px; }
    @media print {
      body { background: white; color: #001830; }
      .section { border: 1px solid #ccc; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${doc.title}</h1>
      <div class="meta">
        <strong>Category:</strong> ${doc.category} | 
        <strong>Features:</strong> ${doc.features.length} | 
        <strong>Generated:</strong> ${timestamp}
      </div>
    </div>

    <div class="section">
      <h2>📋 Executive Summary</h2>
      <p>${doc.summary}</p>
      <div class="stats">
        <div class="stat-card">
          <div class="stat-value">${doc.features.length}</div>
          <div class="stat-label">Features</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${doc.features.reduce((sum, f) => sum + f.userStories.length, 0)}</div>
          <div class="stat-label">User Stories</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${doc.features.reduce((sum, f) => sum + f.suggestedSources.length, 0)}</div>
          <div class="stat-label">Code Sources</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${doc.features.filter(f => f.codeStrategy === 'extend').length}</div>
          <div class="stat-label">Extend Strategy</div>
        </div>
      </div>
    </div>

    <div class="section">
      <h2>🔄 Creation Flow</h2>
      <div class="flow-chart">
        <div class="flow-node">
          <h4>1. Document Analysis</h4>
          <p>Parsed requirements document and identified ${doc.features.length} key features in the ${doc.category} category.</p>
        </div>
        <div class="flow-node">
          <h4>2. Feature Breakdown</h4>
          <p>Each feature analyzed for user stories, acceptance criteria, and technical requirements.</p>
        </div>
        <div class="flow-node">
          <h4>3. Code Source Identification</h4>
          <p>Scanned vault for existing patterns and mods that can be reused or extended.</p>
        </div>
        <div class="flow-node">
          <h4>4. Strategy Selection</h4>
          <p>Determined optimal approach: extend, rewrite, or build new for each feature.</p>
        </div>
        <div class="flow-node">
          <h4>5. Implementation Plan</h4>
          <p>Generated detailed test plans and verification steps for each feature.</p>
        </div>
      </div>
    </div>

    <div class="section">
      <h2>🎯 Overall Reasoning</h2>
      <div class="reasoning">${doc.overallReasoning}</div>
    </div>

    ${doc.features.map((feature, idx) => `
      <div class="section">
        <h2>Feature ${idx + 1}: ${feature.name}</h2>
        
        <div class="feature-card">
          <h4>${feature.name}</h4>
          <p>${feature.description}</p>
          
          <div style="margin-top: 15px;">
            <span class="badge badge-${feature.codeStrategy}">${feature.codeStrategy.toUpperCase()} Strategy</span>
          </div>
        </div>

        <h3>📖 User Stories & Epics</h3>
        ${feature.userStories.map(story => `
          <div class="story">
            <div class="story-title">${story.title}</div>
            <div class="story-text">
              <strong>As a</strong> ${story.asA},<br>
              <strong>I want</strong> ${story.iWant},<br>
              <strong>So that</strong> ${story.soThat}
            </div>
            <div style="margin-top: 10px;">
              <strong>Acceptance Criteria:</strong>
              <ul>
                ${story.acceptanceCriteria.map(c => `<li>${c}</li>`).join('')}
              </ul>
            </div>
          </div>
        `).join('')}

        <div class="not-list">
          <h5>⚠️ What This Feature is NOT Supposed To Do</h5>
          <ul>
            ${feature.notSupposedTo.map(n => `<li>${n}</li>`).join('')}
          </ul>
        </div>

        <h3>✅ Required Outcome</h3>
        <p>${feature.requiredOutcome}</p>

        <div class="test-plan">
          <h5>🧪 Testing & Verification Plan</h5>
          <ul>
            ${feature.testPlan.map(t => `<li>${t}</li>`).join('')}
          </ul>
        </div>

        <h3>🔗 Code Sources & Reuse Strategy</h3>
        ${feature.suggestedSources.map(source => {
          const mod = MODS.find(m => m.id === source.modId);
          return `
            <div class="source-card">
              <div class="source-header">
                <div>
                  <div class="source-name">${source.modName}</div>
                  <div class="source-platform">${source.platform}</div>
                </div>
                <span class="badge badge-source">${source.reuseType}</span>
              </div>
              <div style="margin-top: 10px;">
                <strong>Patterns to use:</strong> ${source.patterns.join(', ')}
              </div>
              ${mod ? `<div style="margin-top: 10px; font-size: 0.9em; color: #c8c4b8;"><strong>Reliability:</strong> ${mod.reliability}% | <strong>Rating:</strong> ${mod.rating}/5</div>` : ''}
              <div class="reasoning" style="margin-top: 10px;">${source.reasoning}</div>
            </div>
          `;
        }).join('')}

        <h3>💭 Implementation Reasoning</h3>
        <div class="reasoning">${feature.reasoning}</div>
      </div>
    `).join('')}

    <div class="section">
      <h2>💡 Workflow Improvement Suggestions</h2>
      ${doc.workflowSuggestions.map(s => `
        <div class="suggestion">${s}</div>
      `).join('')}
    </div>

    <div class="section" style="text-align: center; color: #c8c4b8; font-size: 0.9em;">
      <p>Generated by Gridiron Forge MOD Studio</p>
      <p>Maize & Blue · Go Blue! 🏈</p>
    </div>
  </div>
</body>
</html>`;
}

export function downloadReport(doc: ParsedDocument) {
  const html = generateModReport(doc);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mod-report-${doc.title.toLowerCase().replace(/\s+/g, '-')}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
