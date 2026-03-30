---
description: "Reconfigure your tools and budget settings. Run this after /init-project if you need to change your answers."
agent: "manager"
---

Your current setup (from when you ran `/init-project`):

```
Tools: $(cat .agents/state.json | grep -A 2 'tools')
Budget: $(cat .agents/state.json | grep 'budget')
```

**Want to change something?**

### Q1: Do you have Claude Code CLI available?
- [ ] Yes, GitHub Copilot + Claude Code CLI
- [ ] No, GitHub Copilot only
- [ ] Not sure / describe your setup

### Q2: What's your budget for this project?
- [ ] Free tier only (I'll research and recommend free services)
- [ ] Paid services available
- [ ] Budget TBD / Don't worry about it

---

Once you answer, I'll:
1. Update `.agents/state.json` with your new settings
2. If you now have Claude Code CLI: generate/activate MODULES.md for complex routing
3. If you're switching to free budget: create a research task for free deployment options
4. Recalibrate the project plan if needed

**Your settings control how I route work**:
- No Claude Code CLI → everything stays in GitHub Copilot
- Free budget → I create tasks to research free alternatives
- Paid budget → I use production-grade tools
