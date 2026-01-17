# Docker Deployment Guide

## Overview

This guide covers building and deploying the Residence Resident Portal using Docker.

## GitHub Actions CI/CD

### Automated Builds

The repository includes a GitHub Actions workflow that automatically:
- Builds Docker images on every push to `main` branch
- Pushes images to Docker Hub
- Supports multi-platform builds (amd64, arm64)
- Creates tagged versions for releases

### Setup GitHub Secrets

To enable automated builds, configure these repository secrets in GitHub:

1. Go to your GitHub repository: https://github.com/olbius/residence_resident
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `DOCKERHUB_USERNAME` | Your Docker Hub username | `myusername` |
| `DOCKERHUB_TOKEN` | Docker Hub access token | `dckr_pat_xxxxx` |

#### Creating a Docker Hub Access Token

1. Log in to [Docker Hub](https://hub.docker.com/)
2. Go to **Account Settings** → **Security** → **Access Tokens**
3. Click **New Access Token**
4. Give it a name (e.g., "GitHub Actions")
5. Select permissions: **Read, Write, Delete**
6. Click **Generate** and copy the token
7. Add it as `DOCKERHUB_TOKEN` in GitHub secrets

### Workflow Triggers

The workflow runs on:
- **Push to main**: Builds and pushes with `latest` tag
- **Pull requests**: Builds only (no push)
- **Version tags** (e.g., `v1.0.0`): Builds and pushes with version tags
- **Manual trigger**: Via GitHub Actions UI

### Image Tags

Images are automatically tagged as:
- `latest` - Latest build from main branch
- `main` - Same as latest
- `v1.0.0` - Semantic version tags
- `v1.0` - Major.minor version
- `v1` - Major version only
- `main-abc1234` - Branch with commit SHA

## Manual Docker Build

### Build Locally

```bash
# Build the image
docker build -t fndocker/residence_resident:latest .

# Build with custom tag
docker build -t fndocker/residence_resident:v1.0.0 .
```

### Multi-platform Build

```bash
# Create a new builder instance
docker buildx create --name mybuilder --use

# Build for multiple platforms
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t fndocker/residence_resident:latest \
  --push .
```

### Build Arguments

The Dockerfile supports build-time arguments:

```bash
docker build \
  --build-arg NODE_VERSION=18 \
  -t fndocker/residence_resident:latest .
```

## Running the Container

### Basic Run

```bash
# Run the container
docker run -d \
  --name residence-portal \
  -p 3001:80 \
  fndocker/residence_resident:latest
```

Access at: http://localhost:3001

### With Backend Connection

```bash
# Run with backend URL
docker run -d \
  --name residence-portal \
  -p 3001:80 \
  --network my-network \
  fndocker/residence_resident:latest
```

### Environment-Specific Configuration

For production deployment, you'll need to configure the backend URL. You can either:

1. **Use a custom nginx.conf**:
```bash
docker run -d \
  --name residence-portal \
  -p 3001:80 \
  -v $(pwd)/nginx.prod.conf:/etc/nginx/conf.d/default.conf \
  fndocker/residence_resident:latest
```

2. **Use environment variables with nginx template**:
See the docker-compose example below.

## Docker Compose

### Basic Setup

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  residence-portal:
    image: fndocker/residence_resident:latest
    ports:
      - "3001:80"
    networks:
      - residence-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/"]
      interval: 30s
      timeout: 3s
      retries: 3

networks:
  residence-network:
    driver: bridge
```

### With Backend Integration

```yaml
version: '3.8'

services:
  moqui-backend:
    image: moqui/moqui-framework:latest
    ports:
      - "8080:8080"
    networks:
      - residence-network
    environment:
      - JAVA_OPTS=-Xmx2g

  residence-portal:
    image: fndocker/residence_resident:latest
    ports:
      - "3001:80"
    depends_on:
      - moqui-backend
    networks:
      - residence-network
    restart: unless-stopped

networks:
  residence-network:
    driver: bridge
```

Run with:
```bash
docker-compose up -d
```

## Production Deployment

### Using Docker Swarm

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml residence
```

### Using Kubernetes

Create `deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: residence-portal
spec:
  replicas: 3
  selector:
    matchLabels:
      app: residence-portal
  template:
    metadata:
      labels:
        app: residence-portal
    spec:
      containers:
      - name: portal
        image: fndocker/residence_resident:latest
        ports:
        - containerPort: 80
        resources:
          limits:
            memory: "256Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: residence-portal
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 80
  selector:
    app: residence-portal
```

Deploy:
```bash
kubectl apply -f deployment.yaml
```

## Image Information

### Published Images

After successful CI/CD, images are available at:
```
docker pull fndocker/residence_resident:latest
```

### Image Size

- **Build stage**: ~500 MB (Node.js + dependencies)
- **Final image**: ~25 MB (nginx + built assets)

### Security

The final image:
- Uses Alpine Linux (minimal attack surface)
- Runs as non-root user (nginx)
- No development dependencies
- Only contains built static files

## Troubleshooting

### Build Fails in GitHub Actions

1. **Check secrets**: Verify `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` are set correctly
2. **Check permissions**: Token must have Read/Write permissions
3. **Check logs**: View detailed logs in GitHub Actions tab

### Container Won't Start

```bash
# Check logs
docker logs residence-portal

# Check if port is available
netstat -an | grep 3001

# Check container status
docker ps -a
```

### Backend Connection Issues

```bash
# Test backend connectivity from container
docker exec residence-portal wget -O- http://moqui-backend:8080/rest

# Check network
docker network inspect residence-network
```

### Image Pull Issues

```bash
# Verify image exists
docker pull fndocker/residence_resident:latest

# Login to Docker Hub
docker login

# Check image tags
docker images | grep residence_resident
```

## Development Workflow

### Local Development with Docker

```bash
# Build development image
docker build -t residence-portal:dev .

# Run with volume mount for hot reload
docker run -d \
  -p 3001:80 \
  -v $(pwd)/src:/app/src \
  residence-portal:dev
```

### Testing Builds Locally

```bash
# Build
docker build -t test-build .

# Run
docker run --rm -p 3001:80 test-build

# Test
curl http://localhost:3001
```

## CI/CD Pipeline Flow

```
┌─────────────────┐
│   Push to main  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ GitHub Actions  │
│   Triggered     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Checkout Code  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Setup Buildx    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Login to Hub    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Build Image    │
│ (Multi-platform)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Push to Hub    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   ✅ Complete   │
└─────────────────┘
```

## Monitoring

### Health Checks

The container includes a built-in health check:

```bash
# Check health status
docker inspect --format='{{.State.Health.Status}}' residence-portal

# View health check logs
docker inspect --format='{{json .State.Health}}' residence-portal | jq
```

### Logs

```bash
# View logs
docker logs residence-portal

# Follow logs
docker logs -f residence-portal

# Last 100 lines
docker logs --tail 100 residence-portal
```

## Cleanup

```bash
# Stop and remove container
docker stop residence-portal
docker rm residence-portal

# Remove image
docker rmi myusername/residence-resident-portal:latest

# Clean up all unused images
docker image prune -a
```

## Best Practices

1. **Always use specific tags** in production (not `latest`)
2. **Set resource limits** in production deployments
3. **Use health checks** for automatic recovery
4. **Enable logging** to external service
5. **Regular updates** - rebuild images monthly
6. **Scan images** for vulnerabilities
7. **Use secrets management** for sensitive data
8. **Enable HTTPS** with reverse proxy

## Next Steps

1. ✅ Configure GitHub secrets
2. ✅ Push to main to trigger build
3. ✅ Verify image in Docker Hub
4. ⏭️ Deploy to production environment
5. ⏭️ Configure monitoring and alerts

---

For more information, see the main [DEPLOYMENT.md](DEPLOYMENT.md) guide.
