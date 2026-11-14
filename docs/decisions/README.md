# Decisions

One record per product decision taken after the first version of the [spec](../spec.md). Each
says what was asked, what was decided and why, and what was left open. The code cites them as
"decision 15"; the spec section that a decision changes links back to it.

Numbering continues the design notes the first version was built from (1 to 14). Their outcome is
the spec itself, so they are not published separately.

| No. | Decision | Released |
|---|---|---|
| [15](0015-member-visibility.md) | A member's ready times and heat now can be private | 0.1.13, 0.1.14 |
| [16](0016-heat-now-own-temperature.md) | Heat now to an admin's own temperature; each person keeps their own time | 0.1.15, 0.1.16 |
| [17](0017-compact-card.md) | A compact, read-only card for a shared dashboard | 0.1.17 |

A new decision gets the next number, a file `NNNN-short-name.md` with the sections below, a row
here, and the change in the spec in the same commit.

    # NN. Title
    Status, date, release
    ## Context      what was asked and why
    ## Decision     what was decided, as rules
    ## Consequences what follows, including what the integration cannot do
    ## Open         what was not decided
