# PostHog Self-driving setup report

## Summary

PostHog Self-driving is configured for this Astro marketing site. Session Replay, Error Tracking, and Support are enabled; health, error, and support signal sources are active; and two Replay Vision monitors are armed. Findings will start appearing in the [Self-driving inbox](https://eu.posthog.com/project/276731/inbox) within about 30 minutes as data arrives.

## AI data processing

Approved.

## GitHub

GitHub was already connected before this setup. No GitHub Issues responder was enabled because it was not selected.

## Products enabled

| Product | Result | Notes |
|---|---|---|
| Session Replay | already enabled | Web `posthog.init` was checked and has no option that disables recording. No recordings were present at setup time. |
| Error Tracking | enabled | Web `posthog.init` has no option that disables exception capture. |
| Support | enabled | Connect an inbound email, inbox, or Slack channel in PostHog before tickets can arrive. |

## Signal sources

| Signal source | Action | Notes |
|---|---|---|
| `health_checks` / `health_issue` | enabled | Configuration health issues can reach the inbox. |
| `error_tracking` / `issue_created` | enabled | New error issues can reach the inbox. |
| `error_tracking` / `issue_reopened` | enabled | Reopened error issues can reach the inbox. |
| `error_tracking` / `issue_spiking` | enabled | Spiking error issues can reach the inbox. |
| `conversations` / `ticket` | enabled | Stays idle until a Support channel is connected. |
| `signals_scout` / `cross_source_issue` | skipped | Scout findings are enabled by default; no opt-out row was present. |
| `session_replay` / `session_analysis_cluster` | skipped | Retired route; Replay Vision scanners provide session-replay coverage. |
| Connected-tool responders | skipped | No external tools were selected. |

## Connected tools

No connected tools were selected. The warehouse-source inventory was empty. GitHub remains connected at the integration level, but its Issues responder was intentionally not enabled.

## Scout troop

**Enabled (4):**

| Scout | Why it is active |
|---|---|
| `signals-scout-general` | Cross-product correlations and surfaces without a more focused specialist. |
| `signals-scout-product-analytics` | The site has explicit consultation, navigation, contact, and blog interaction events. |
| `signals-scout-web-analytics` | The project is a public website with web analytics enabled. |
| `signals-scout-health-checks` | Keeps PostHog configuration health actionable. |

**Disabled (23):**

| Scout | Reason |
|---|---|
| `signals-scout-ai-observability` | No AI observability data was found. |
| `signals-scout-anomaly-detection` | No established time-series insight set was found to watch. |
| `signals-scout-apm` | No APM or tracing surface was found. |
| `signals-scout-conversations` | Support has no inbound channel or ticket activity yet. |
| `signals-scout-csp-violations` | No CSP reporting configuration was found. |
| `signals-scout-customer-analytics` | No account/group analytics surface was found. |
| `signals-scout-data-pipelines` | No CDP, batch export, or Hog Flow surface was found. |
| `signals-scout-data-warehouse` | No warehouse sources are connected. |
| `signals-scout-error-tracking` | Covered by the active native Error Tracking sources. |
| `signals-scout-experiments` | No active experiment surface was found. |
| `signals-scout-feature-flags` | No feature-flag usage was found. |
| `signals-scout-inbox-validation` | Fresh setup; no resolved Self-driving reports exist to re-check. |
| `signals-scout-insight-alerts` | No alert surface was identified. |
| `signals-scout-logs` | No PostHog Logs usage was found. |
| `signals-scout-mcp-tool-calls` | No project-specific MCP telemetry monitoring need was identified. |
| `signals-scout-observability-gaps` | Kept focused on current website surfaces rather than a broad unproven coverage scan. |
| `signals-scout-replay-vision` | New Replay Vision monitors have no observations yet; replay is covered directly by those monitors. |
| `signals-scout-revenue-analytics` | No payment or revenue data source was found. |
| `signals-scout-session-replay` | Covered by the Replay Vision monitors below. |
| `signals-scout-skills-store` | No team-authored skill store surface needs monitoring. |
| `signals-scout-surveys` | No surveys are active. |
| `signals-scout-tasks` | No task automation surface was found. |
| `signals-scout-web-vitals` | No Web Vitals data surface was confirmed. |

**Run budget:** 100 runs/day, 0 used today, 100 remaining. Announcement: “Scouts are in early access. Each project gets up to 100 scout runs a day. Contact team-self-driving@posthog.com if you need more.”

## Custom scouts

No custom scouts were created: both proposals were declined.

| Considered surface | Assessment |
|---|---|
| Consultation engagement | A viable custom monitor for a material drop between consultation interest and selecting a contact method; it complements, but partly overlaps, web traffic monitoring. Declined. |
| Blog discovery | A viable custom monitor for a material drop from the blog index into articles; it partly overlaps web traffic monitoring. Declined. |

If a future custom scout is noisy, set its `emit` option to `false` in its PostHog scout configuration to keep it running as a dry-run without sending inbox reports.

## Replay Vision scanners

A scanner is an LLM that watches individual session recordings on a schedule and pushes what it finds to the inbox. These are the only parts of this setup that spend Replay Vision quota. Findings arrive at half weight and need independent corroboration before becoming an inbox report.

| Scanner | Status | What it watches | Query scope | Sampling | Estimate |
|---|---|---|---|---:|---:|
| Datapeople consultation breakage | created | Visible failure while a visitor tries to reach the consultation contact experience: unresponsive calls-to-action, broken contact links, or missing contact content. | Sessions whose current URL contains `/#contact`; this is the site’s key consultation completion flow. | 0.5 | 0 observations/month, 0 credits/month |
| Datapeople navigation frustration | created | Visible repeated attempts to use consultation, navigation, contact, or blog links. | Sessions containing `$rageclick` only. | 1.0 | 0 observations/month, 0 credits/month |

No recordings existed during setup, so both scanners are armed and will begin working as soon as recordings arrive. Replay Vision has 2,500 credits remaining this period and was not exhausted when these zero-cost estimates were taken.

## Follow-ups

- [ ] Connect a Support inbound channel (email, inbox, or Slack) in PostHog so the enabled Support ticket responder has data.
- [ ] Generate production site traffic and session recordings; the two armed Replay Vision monitors need recordings before they can observe or send findings.
- [ ] Optionally rate Replay Vision observations with thumbs up/down in each scanner to receive configuration recommendations.

## What happens next

The scout coordinator picks up the fresh configurations within about 30 minutes. Scout runs draw from the verified daily budget, findings cluster into reports in the inbox, and immediately actionable reports can begin coding tasks.

## Files modified

- Created `posthog-self-driving-report.md`.
- No application source files were modified.
