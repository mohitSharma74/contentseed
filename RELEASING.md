# Releasing

This repository uses manual SemVer releases and changelog entries.

## Release Checklist

1. Ensure CI is green on `main`.
2. Update `CHANGELOG.md` with a new version section and date.
3. Bump `package.json` version.
4. Create and push a git tag:

```bash
git tag vX.Y.Z
git push origin vX.Y.Z
```

5. Create a GitHub release from the tag and copy relevant changelog notes.

## Versioning Guidance

- Patch (`x.y.Z`): bug fixes and docs-only tooling changes
- Minor (`x.Y.z`): backward-compatible features
- Major (`X.y.z`): breaking changes
