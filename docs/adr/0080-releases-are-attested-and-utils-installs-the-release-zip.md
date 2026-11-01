# 0080 Releases are attested and Utils installs the release zip

Status: accepted

## Decision

Every release asset of Magic Card and Magic Card Utils carries a build provenance attestation, so anyone can check that a download came from the release workflow on a protected tag and was not uploaded by hand. HACS installs Utils from the attested magic_card_utils.zip (`zip_release`), because it would otherwise install the source tree of the tag, and the files people run would be neither the attested nor the tested ones. GitHub attests private repositories only on Enterprise plans, so no private trial run was possible and the first pre-release that carries attestations is their first proof.
