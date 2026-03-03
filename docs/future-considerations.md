# Future Considerations

This document captures security and privacy ideas that are intentionally out of scope for the MVP but should be revisited.

---

**1) PII and Field-Level Access**

Potential requirements:
1. Allow `ADMIN` to manage student profile fields (name, email, password reset) without access to teacher/guardian notes.
2. Allow `TEACHER` and `GUARDIAN` to update their own profile details, but restrict visibility of other users' data.
3. Restrict `STUDENT` access to only their own profile fields and assigned data.

Possible approach:
- Introduce a `profileService` with field-level allowlists per role.
- Add a `NoteVisibility` concept if required (e.g., teacher-only notes).
- Log access to sensitive fields (audit trail).

---

**2) Audit Logging**

Track changes to:
1. Student profiles
2. Access grants/revokes
3. Note edits and deletions

This may require an `AuditLog` model and role-gated read access.

---

**3) Organization / School Multi-Tenancy**

If targeting music schools:
1. Introduce `Organization` and `Membership` models.
2. Scope all access by organization.
3. Constrain `ADMIN` to organization-level.

---

**4) Legal/Compliance**

If handling minors:
1. Review COPPA/FERPA/other regional requirements.
2. Consider data retention policies and parental consent flows.

