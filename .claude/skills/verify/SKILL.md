---
name: verify
description: Run a full Jekyll build to validate the site compiles without errors. Use after making changes to templates, data files, or config.
---

Run the Jekyll build and report results:

```bash
bundle exec jekyll build 2>&1
```

If the build fails, analyze the error output and fix the issue. Common failure causes:
- Broken Liquid template syntax in `_layouts/v2.html`
- Invalid YAML in `_data/*.yml` or `_config.yml`
- Missing translation keys referenced via the `t` filter
- Invalid frontmatter in `en.md` or `fr.md`

After fixing, re-run the build to confirm the fix works.
