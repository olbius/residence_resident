# GitHub Setup Guide

## Configure Repository Secrets for Docker Hub

To enable automated Docker builds and pushes to Docker Hub, you need to configure GitHub repository secrets.

### Step-by-Step Instructions

#### 1. Go to Repository Settings

Visit: https://github.com/olbius/residence_resident/settings/secrets/actions

Or navigate manually:
1. Go to https://github.com/olbius/residence_resident
2. Click **Settings** tab
3. Click **Secrets and variables** in the left sidebar
4. Click **Actions**

#### 2. Add DOCKERHUB_USERNAME Secret

1. Click **New repository secret**
2. Name: `DOCKERHUB_USERNAME`
3. Secret: `fndocker` (your Docker Hub username)
4. Click **Add secret**

#### 3. Add DOCKERHUB_TOKEN Secret

First, create a Docker Hub access token:

**Create Token on Docker Hub:**
1. Log in to https://hub.docker.com/
2. Click your username (top right) → **Account Settings**
3. Go to **Security** → **Access Tokens**
4. Click **New Access Token**
5. Settings:
   - **Description**: `GitHub Actions - residence_resident`
   - **Access permissions**: **Read, Write, Delete**
6. Click **Generate**
7. **Copy the token** (you won't see it again!)

**Add Token to GitHub:**
1. Go back to GitHub secrets page
2. Click **New repository secret**
3. Name: `DOCKERHUB_TOKEN`
4. Secret: Paste the token you copied (e.g., `dckr_pat_abc123...`)
5. Click **Add secret**

#### 4. Verify Secrets

You should now see two secrets:
- ✅ `DOCKERHUB_USERNAME`
- ✅ `DOCKERHUB_TOKEN`

## Testing the Workflow

### Automatic Trigger

The workflow automatically runs when you:
- Push to the `main` branch
- Create a pull request
- Push a version tag (e.g., `v1.0.0`)

### Manual Trigger

You can also manually trigger the workflow:

1. Go to https://github.com/olbius/residence_resident/actions
2. Click on **Build and Push Docker Image** workflow
3. Click **Run workflow** button
4. Select branch: `main`
5. Click **Run workflow**

### View Workflow Progress

1. Go to https://github.com/olbius/residence_resident/actions
2. Click on the latest workflow run
3. Watch the build progress in real-time
4. Check for any errors in the logs

## Expected Workflow Behavior

### On Push to Main Branch

When you push to `main`, the workflow will:

1. ✅ Checkout the code
2. ✅ Set up Docker Buildx
3. ✅ Log in to Docker Hub using your secrets
4. ✅ Build the Docker image for multiple platforms (amd64, arm64)
5. ✅ Push the image to `fndocker/residence_resident:latest`
6. ✅ Also push with additional tags:
   - `fndocker/residence_resident:main`
   - `fndocker/residence_resident:main-<commit-sha>`

### On Version Tag

When you create a version tag (e.g., `v1.0.0`):

```bash
git tag v1.0.0
git push origin v1.0.0
```

The workflow will push:
- `fndocker/residence_resident:1.0.0`
- `fndocker/residence_resident:1.0`
- `fndocker/residence_resident:1`
- `fndocker/residence_resident:latest`

## Verify Docker Image

After the workflow completes successfully, verify the image:

### On Docker Hub Website

1. Go to https://hub.docker.com/r/fndocker/residence_resident
2. Check the **Tags** tab
3. You should see `latest`, `main`, and commit-based tags

### Pull and Test Locally

```bash
# Pull the image
docker pull fndocker/residence_resident:latest

# Run the container
docker run -d -p 3001:80 fndocker/residence_resident:latest

# Test the application
curl http://localhost:3001

# Check container logs
docker logs $(docker ps -q -f ancestor=fndocker/residence_resident:latest)
```

## Troubleshooting

### Workflow Fails at Login Step

**Error**: "Error: Cannot perform an interactive login from a non TTY device"

**Solution**:
- Check that `DOCKERHUB_USERNAME` is set correctly
- Check that `DOCKERHUB_TOKEN` is a valid access token (not your password)
- Regenerate the token if needed

### Workflow Fails at Push Step

**Error**: "denied: requested access to the resource is denied"

**Solution**:
- Verify the Docker Hub repository exists: https://hub.docker.com/r/fndocker/residence_resident
- Check token permissions include "Write" access
- Verify username matches repository owner

### Image Not Found After Push

**Problem**: Workflow succeeds but can't pull image

**Solution**:
- Check repository is public (or you're logged in)
- Wait a few minutes for Docker Hub to sync
- Check the workflow logs for the actual image name pushed

## Security Best Practices

### Token Security

✅ **Do:**
- Use access tokens (never passwords)
- Create tokens with minimal required permissions
- Rotate tokens regularly (every 90 days)
- Use descriptive token names
- Delete unused tokens

❌ **Don't:**
- Share tokens publicly
- Commit tokens to code
- Use overly permissive tokens
- Reuse tokens across projects

### Secret Management

✅ **Do:**
- Use GitHub repository secrets
- Limit secret access to necessary workflows
- Audit secret usage regularly
- Document what each secret is for

❌ **Don't:**
- Print secrets in logs
- Pass secrets as command line arguments
- Store secrets in code or config files

## Next Steps

After secrets are configured:

1. ✅ Push to main branch to trigger first build
2. ✅ Verify image appears on Docker Hub
3. ✅ Test pulling and running the image
4. ✅ Set up production deployment
5. ✅ Configure monitoring for failed builds

## Maintenance

### Regular Tasks

**Monthly:**
- Review and rotate access tokens
- Check for workflow failures
- Update base images (node, nginx)

**Quarterly:**
- Audit secret usage
- Review security permissions
- Update GitHub Actions versions

**As Needed:**
- Rebuild images after security patches
- Update documentation
- Optimize build times

## Support

If you encounter issues:

1. Check the [DOCKER.md](DOCKER.md) documentation
2. Review workflow logs in GitHub Actions
3. Verify secrets are configured correctly
4. Check Docker Hub repository settings

## Quick Reference

| Item | Value |
|------|-------|
| **Repository** | https://github.com/olbius/residence_resident |
| **Docker Hub** | https://hub.docker.com/r/fndocker/residence_resident |
| **Workflow File** | `.github/workflows/docker-build.yml` |
| **Secrets Needed** | `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN` |
| **Image Name** | `fndocker/residence_resident` |
| **Default Port** | 3001 → 80 |

---

**Last Updated**: January 17, 2026  
**Status**: Ready for configuration ✅
