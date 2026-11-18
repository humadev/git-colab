# Git Collaboration Playground

A simple, zero-dependency HTML/CSS/JavaScript web application designed to help teachers and students practice **real Git collaboration**: cloning, creating feature branches, committing changes, opening Pull Requests, and resolving merge conflicts.

## Previewing the App

You can open the app directly in any web browser—no build tools or `npm install` needed:

- **macOS:** `open index.html`
- **Local web server (recommended):**
  ```bash
  python3 -m http.server 8000
  ```
  Then open `http://localhost:8000` in your browser.

---

## Teacher Setup (Before Class)

1. Push this repository to GitHub (or GitLab/Gitea) on the `main` branch.
2. Share the repository URL with your students (either add students as collaborators or have them fork the repo).
3. Optional: Protect `main` in repository settings so students practice opening Pull Requests instead of pushing directly to `main`.

---

## Lab 1: Branching & Pull Requests (No Conflict)

**Goal:** Every student adds their own profile card to the **Class Contributors Wall** without touching anyone else's work.

1. **Clone & inspect status:**
   ```bash
   git clone <repo-url>
   cd git-colab
   git status
   ```
2. **Create a feature branch:**
   ```bash
   git switch -c feat/add-yourname
   ```
3. **Edit `index.html`:**
   - Look for the comment:
     `<!-- 🎯 EXERCISE 1 (ADD YOUR CARD): Copy the <article class="student-card"> block below, paste it above this comment, and fill in your details! -->`
   - Copy the commented `<article class="student-card">` template, paste it **above** the comment, uncomment it, and fill in your initials, name, GitHub handle, bio, and favorite Git command.
   - *(Optional)* Add a one-line tip inside `#shoutouts-list`.
4. **Preview in your browser** to confirm your card appears and the Contributor counter updates automatically.
5. **Stage, commit, and push:**
   ```bash
   git add index.html
   git commit -m "feat: add <Your Name> profile card"
   git push -u origin feat/add-yourname
   ```
6. **Open a Pull Request** on GitHub targeting `main`, request a peer review from a classmate, and merge!

---

## Lab 2: Intentional Merge Conflict (Teacher + Student)

**Goal:** Trigger a real merge conflict in a safe, obvious spot so students learn how to read and resolve `<<<<<<<`, `=======`, and `>>>>>>>` markers.

### Option A: HTML Motto Conflict (`index.html`)

1. **Teacher (or Student A)** creates branch `feat/motto-a`, edits `#class-motto` inside `<!-- 🎯 EXERCISE 2 (MERGE CONFLICT) -->` in `index.html`, commits, and merges into `main`:
   ```html
   <p id="class-motto" class="motto">"Small commits make big projects easy!"</p>
   ```
2. **Student B** (starting from the older `main`) creates branch `feat/motto-b`, edits the exact same `#class-motto` line in `index.html`, and commits:
   ```html
   <p id="class-motto" class="motto">"Branch often, review carefully, merge proudly!"</p>
   ```
3. **Student B** pulls or merges `main` into their branch:
   ```bash
   git fetch origin
   git merge origin/main
   ```
4. Git pauses and reports a conflict in `index.html`. Open `index.html` and inspect the conflict markers:
   ```html
   <<<<<<< HEAD
   <p id="class-motto" class="motto">"Branch often, review carefully, merge proudly!"</p>
   =======
   <p id="class-motto" class="motto">"Small commits make big projects easy!"</p>
   >>>>>>> origin/main
   ```
5. **Resolve the conflict:**
   - Choose one motto or combine both into a single clean `<p id="class-motto" class="motto">...</p>` line.
   - Delete the `<<<<<<< HEAD`, `=======`, and `>>>>>>> origin/main` lines.
   - Refresh the browser to verify the page looks right.
6. **Finish the merge:**
   ```bash
   git add index.html
   git commit -m "chore: resolve class motto merge conflict"
   git push
   ```

### Option B: CSS Theme Conflict (`styles.css`)

1. Two students edit `--primary` or `--banner-bg` at the top of `:root` in `styles.css` (marked with `/* 🎯 OPTIONAL CSS CONFLICT EXERCISE */`) on separate branches.
2. Merge the first branch into `main`, then merge `main` into the second branch to practice resolving a CSS conflict and verifying the theme colors in the browser.
