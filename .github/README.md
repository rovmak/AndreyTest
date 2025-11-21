# GitHub Actions Setup

This project includes automated Playwright test execution via GitHub Actions.

## 🕐 Schedule

Tests run automatically **every Monday at 9 AM PST (5 PM UTC)**.

> **Note**: GitHub Actions uses UTC time. The cron schedule `0 17 * * 1` means:
> - `0` = minute (00)
> - `17` = hour (5 PM UTC = 9 AM PST)
> - `*` = any day of month
> - `*` = any month
> - `1` = Monday (0=Sunday, 1=Monday, etc.)

### PST vs PDT (Daylight Saving Time)
- **PST (Winter)**: 9 AM PST = 5 PM UTC (17:00)
- **PDT (Summer)**: 9 AM PDT = 4 PM UTC (16:00)

The workflow is set for PST. If you want it to adjust for PDT, update the cron to `0 16 * * 1`.

## 📋 Workflows

### 1. **playwright.yml** (Simple)
- Runs all Playwright tests
- Single browser (default: Chromium)
- Uploads test reports and results
- Artifacts retained for 30 days

### 2. **playwright-enhanced.yml** (Advanced)
- Runs tests on multiple browsers (Chromium, Firefox, WebKit)
- Matrix strategy for parallel execution
- Separate reports per browser
- Manual trigger with browser selection
- Notification summary

## 🚀 Manual Trigger

You can manually trigger the workflow from GitHub:

1. Go to your repository on GitHub
2. Click **Actions** tab
3. Select the workflow (e.g., "Playwright Tests - Weekly Monday Run")
4. Click **Run workflow** button
5. Select branch and run

## 📊 Viewing Results

After each run:

1. Go to **Actions** tab in GitHub
2. Click on the workflow run
3. View test results in the summary
4. Download artifacts:
   - `playwright-report` - HTML test report
   - `test-results` - Detailed test results

## 📁 Workflow Files Location

```
.github/
└── workflows/
    ├── playwright.yml           # Simple workflow
    └── playwright-enhanced.yml  # Enhanced workflow with matrix
```

## ⚙️ Configuration

### Change Schedule

Edit the cron expression in the workflow file:

```yaml
schedule:
  - cron: '0 17 * * 1'  # Monday at 9 AM PST
```

**Examples:**
- Every day at 9 AM PST: `'0 17 * * *'`
- Every weekday at 9 AM PST: `'0 17 * * 1-5'`
- Twice a week (Mon, Thu) at 9 AM PST: `'0 17 * * 1,4'`
- First Monday of month at 9 AM PST: `'0 17 1-7 * 1'`

### Add Notifications

You can add notifications for test results. Here are some options:

#### Slack Notification
```yaml
- name: Slack Notification
  uses: 8398a7/action-slack@v3
  if: always()
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

#### Email Notification
```yaml
- name: Send Email
  uses: dawidd6/action-send-mail@v3
  if: failure()
  with:
    server_address: smtp.gmail.com
    server_port: 465
    username: ${{ secrets.EMAIL_USERNAME }}
    password: ${{ secrets.EMAIL_PASSWORD }}
    subject: Playwright Tests Failed
    to: your-email@example.com
    from: GitHub Actions
    body: Tests failed! Check the report.
```

#### Discord Notification
```yaml
- name: Discord Notification
  uses: sarisia/actions-status-discord@v1
  if: always()
  with:
    webhook: ${{ secrets.DISCORD_WEBHOOK }}
    status: ${{ job.status }}
    title: Playwright Test Results
```

### Add Test Summary

Add this step to show results in the GitHub Actions summary:

```yaml
- name: Publish Test Summary
  uses: dorny/test-reporter@v1
  if: always()
  with:
    name: Playwright Tests
    path: test-results/*.xml
    reporter: java-junit
```

## 🔒 Secrets Management

To add secrets (for notifications, etc.):

1. Go to repository **Settings**
2. Click **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add your secrets (e.g., `SLACK_WEBHOOK`, `EMAIL_PASSWORD`)

## 📦 Required Files

The workflow expects these files in your repository:

- `package.json` - Dependencies
- `playwright.config.ts` - Playwright configuration
- `tests/` - Test files

## 🐛 Troubleshooting

### Workflow doesn't run at scheduled time
- GitHub Actions may delay scheduled runs by 3-10 minutes
- Scheduled workflows may be disabled if no repository activity for 60 days
- Re-enable from Actions tab if disabled

### Tests fail in CI but pass locally
- Check browser versions
- Ensure all dependencies are installed
- Review test timeouts
- Check for timing issues

### Artifacts not uploading
- Ensure paths exist: `playwright-report/`, `test-results/`
- Check retention days setting
- Verify workflow has write permissions

## 📈 Best Practices

1. **Keep workflows fast**: Use `--shard` for parallel execution
2. **Use caching**: Cache `node_modules` and Playwright browsers
3. **Set timeouts**: Prevent workflows from running indefinitely
4. **Separate workflows**: Different workflows for different purposes
5. **Use matrix**: Test on multiple browsers/environments
6. **Store secrets**: Never hardcode credentials
7. **Monitor usage**: GitHub Actions has usage limits

## 🔗 Useful Links

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Cron Schedule Expression](https://crontab.guru/)
- [Playwright CI Documentation](https://playwright.dev/docs/ci)
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)

## 📝 Example: Custom Schedule

To run tests multiple times per week:

```yaml
on:
  schedule:
    # Monday at 9 AM PST
    - cron: '0 17 * * 1'
    # Wednesday at 9 AM PST
    - cron: '0 17 * * 3'
    # Friday at 9 AM PST
    - cron: '0 17 * * 5'
```
