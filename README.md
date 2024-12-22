# Hosts Tweak

1. Open a text editor in administration mode.
2. Open the file: `C:\Windows\System32\drivers\etc\hosts`.
3. Add the line: `127.0.0.1 ingress-srv-host-name`.
4. Save and close.

# Install Scoop

1. Open PowerShell in administration mode.
2. Go to [https://scoop.sh/](https://scoop.sh/).
3. Run:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
4. Run:
   ```powershell
   Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
   ```

# Install Skaffold

1. Open Bash and type:
   ```bash
   nano ~/.bashrc
   ```
2. Add this line:
   ```bash
   export PATH=$PATH:/c/Users/<your-username>/scoop/shims
   ```
3. Save the file.
4. Reload the shell by running:
   ```bash
   source ~/.bashrc
   ```
5. Define `skaffold.yaml`.

# Run Ingress Controller

1. Go to [Ingress-NGINX Quick Start](https://kubernetes.github.io/ingress-nginx/deploy/#quick-start).
2. Find the following command:
   ```bash
   kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.12.0-beta.0/deploy/static/provider/cloud/deploy.yaml
   ```
3. Run it.
4. Define an `ingress-srv.yaml`.

# Start

1. Make sure Docker and Kubernetes are up and running on your system.
2. Run:
   - For detached mode:
     ```bash
     skaffold run
     ```
   - For watch mode:
     ```bash
     skaffold dev
     ```

# Splitting Your Git Repo While Maintaining Commit History

Follow the guide here: [Splitting Your Git Repo While Maintaining Commit History](https://amandawalkerbrubaker.medium.com/splitting-your-git-repo-while-maintaining-commit-history-35b9f4597514)
