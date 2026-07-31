# Deployment Configuration

This directory indexes deployment profiles for the repository application. Runtime topology remains authoritative in `../specs/topology.spec.json`; `topology/` contains the source environment materialization inputs.

Client roots delegate to this index and materialize platform-specific environment files at build time. Secrets are never committed here.
