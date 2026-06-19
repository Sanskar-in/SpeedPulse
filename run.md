# Complete Guide: How to Run the SpeedPulse Internet Speed Checker

This document provides exhaustive, unshortened instructions on how to set up, build, and run the SpeedPulse Internet Speed Checker locally on your machine. This application utilizes a modern full-stack architecture with an ASP.NET Core backend and a TypeScript-powered frontend.

## 1. System Prerequisites

Before you can run the application, you must ensure that your system has the correct SDKs and runtime environments installed. This project requires two major ecosystems:

### A. .NET SDK (For the Backend)
The backend is written in C# utilizing the minimal API features of ASP.NET Core. 
1. Download the **.NET 10.0 SDK** (or whichever version is currently specified in your project) from the official Microsoft .NET website: https://dotnet.microsoft.com/download
2. Run the installer and follow the standard installation prompts.
3. Once installed, verify the installation by opening a command prompt or PowerShell and typing:
   ```bash
   dotnet --info
   ```
   You should see the .NET SDK version listed. If you do not, you may need to restart your terminal or computer to refresh your system's `PATH` variables.

### B. Node.js & npm (For the Frontend Compilation)
The frontend logic is written in strict TypeScript. Browsers cannot run TypeScript natively, so we use the TypeScript Compiler (`tsc`) via Node.js to transpile the `.ts` files into browser-compatible JavaScript (`.js`).
1. Download **Node.js** from the official website: https://nodejs.org/
2. Install the LTS (Long Term Support) version. This installation includes `npm` (Node Package Manager).
3. Verify the installation by running:
   ```bash
   node -v
   npm -v
   ```

## 2. Compiling the Frontend (TypeScript)

The source code for the frontend is located in the `src/` directory. These `.ts` files must be compiled and output into the `wwwroot/` directory so that the ASP.NET Core server can serve them as static files.

1. Open a terminal and navigate to the root directory of the project (where the `package.json` and `tsconfig.json` files are located).
2. Install the necessary development dependencies (such as the TypeScript compiler):
   ```bash
   npm install
   ```
3. Run the TypeScript compiler:
   ```bash
   npx tsc
   ```
   *(Note: The `tsconfig.json` file is configured to look in the `src/` folder and output the resulting `script.js`, `history.js`, `speedtest.js`, and `utils.js` directly into the `wwwroot/` folder. If `npx tsc` completes without any critical errors, the compilation was successful.)*

## 3. Building the Backend (ASP.NET Core)

The backend handles the extreme-throughput data streaming required to accurately measure Gigabit internet speeds locally. It is defined primarily in the `Program.cs` file.

1. In the same terminal at the project root, restore any .NET dependencies and compile the C# code by running:
   ```bash
   dotnet build
   ```
2. You should see a message indicating `Build succeeded.` with 0 errors.

## 4. Running the Application

Once both the frontend and backend are successfully compiled, you can launch the local web server.

1. Run the following command to start the Kestrel web server:
   ```bash
   dotnet run
   ```
2. The console will output several lines indicating that the application has started. Look for a line that resembles:
   ```
   info: Microsoft.Hosting.Lifetime[14]
         Now listening on: http://localhost:5000
   ```
3. Open your preferred modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, or Safari).
4. Type the URL provided in the console (e.g., `http://localhost:5000`) into the address bar and press Enter.

## 5. Performing a Speed Test

Once the web interface loads:
1. Locate the **Select Server** dropdown on the main interface.
2. You have two choices:
   - **Local ASP.NET Server:** This targets the `dotnet run` instance you just started. It measures the throughput capacity of your local network (loopback if on the same machine, or Wi-Fi/LAN if testing from another device on your network).
   - **Cloudflare Global CDN:** This targets Cloudflare's edge nodes. It measures your actual ISP internet connection speed.
3. Click the **Start Test** button.
4. The application will sequentially run a Ping (Latency) test, a Download throughput test, and finally an Upload throughput test. You can view the real-time graph updating dynamically.

## 6. Stopping the Server

When you are finished testing the application, you must stop the ASP.NET Core server to free up the network port (e.g., port 5000).
1. Return to the terminal where `dotnet run` is active.
2. Press `Ctrl + C` on your keyboard.
3. The server will gracefully shut down.

## Troubleshooting

- **Port in use error:** If `dotnet run` complains that the port is already in use, you may have another instance of the server running in the background. Ensure you've pressed `Ctrl + C` in any other open terminals, or restart your terminal.
- **Frontend changes not showing:** If you edit any `.ts` files in the `src/` folder, you MUST run `npx tsc` again before running `dotnet run` so that the updated JavaScript is copied to the `wwwroot/` folder.
- **Speeds seem impossibly fast:** If you test against the "Local ASP.NET Server" on the same computer hosting the server, you are measuring your computer's internal loopback speed. This can easily reach multiple Gigabits per second. To test your real internet speed, switch the dropdown to Cloudflare.
