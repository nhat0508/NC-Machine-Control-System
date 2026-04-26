# NC Machine — Operational Workflow Overview

This project demonstrates a **multi-axis Numerical Control (NC) machine** controlled through **TwinCAT**, **Node.js**, and a **React-based web interface**.  

The focus of this document is on the **system’s operation flow**, illustrating how each component collaborates to deliver precise, synchronized motion control.

After you download the project, you can see the report and instructions files about how the sytem works and how to install needed packages and run the system.

---

## 1. System Operation Concept

The NC machine integrates three functional layers that work in real-time coordination:

- **TwinCAT (Execution Layer):**  
  Executes motion logic, synchronizes the axes (X, Y, Z), and ensures deterministic control through servo drives.  
- **Node.js (Communication Layer):**  
  Relays commands and data between PLC and frontend at high frequency (typically <50 ms latency).  
- **React (Visualization Layer):**  
  Provides a live digital representation of machine status, enabling intuitive supervisory control through any modern web browser.

Together, these layers create a closed-loop architecture where operator commands, machine feedback, and live visualization continuously interact.

---

## 2. Operational Workflow

The following sequence describes the standard operating procedure of the NC system from activation to task completion.

### 2.1 System Initialization
1. Operator powers the control cabinet and enables TwinCAT runtime.  
2. PLC automatically performs hardware diagnostics and confirms communication with each servo axis.  
3. System transitions to **“Ready”** state once all drives are enabled and reference limits are validated.  
4. If faults are present, the **Fault Reset** routine must be executed before motion release.

---

### 2.2 Mode Selection
The operator chooses the desired mode from the web interface:

- **Manual (Jog) Mode:**  
  Used for setup and machine referencing.  
  - Operator can jog each axis incrementally.  
  - Homing process establishes absolute position.  
  - Speed limits prevent unwanted fast movements.

- **Automatic (G-code) Mode:**  
  Executes predefined trajectories from an uploaded NC file.  
  - PLC parses G-code instructions line by line.  
  - The three axes move synchronously, interpolating linear or circular paths.  
  - Feedrate and acceleration profiles are dynamically adjusted for smooth motion.  

---

### 2.3 Execution Cycle
Once Auto mode is active:
1. The program starts interpreting G-code commands.  
2. TwinCAT computes motion trajectories for all active axes in real time.  
3. Node.js continuously exchanges axis states (position, velocity, status bits) with the frontend.  
4. The web client mirrors all movements via animated 3D rendering, providing a **Digital Twin** of the real machine.  

---

### 2.4 Monitoring and Intervention
During the process, the system allows dynamic operator intervention:
- The **Feedrate Override** slider adjusts motion speed in real time.  
- The **Single Block Mode** executes one instruction line per user confirmation, ideal for dry-run testing.  
- When abnormal vibration, load, or heat is observed, the operator can pause or stop execution immediately.  

The interface also visualizes:
- Actual and target axis positions  
- Commanded velocity and active G-code line  
- Alarm or limit switch status indicators  

---

### 2.5 Safety & Fault Handling
The system includes coordinated safety responses and recovery mechanisms:
- **Emergency Stop (E-Stop):** Immediately disables power stages of all drives.  
- **Software Motion Limits:** Prevent overtravel and mechanical collision.  
- **Automatic Reset Logic:** Ensures safe reactivation by requiring user acknowledgment after any E-Stop or motion fault.  
- **Servo Monitoring:** Each axis monitors torque and position deviation to detect mechanical binding or encoder faults.  

---

### 2.6 Process Completion
At the end of operation:
1. All axes decelerate to stop positions under controlled ramp limits.  
2. The system logs the job result and overall execution time.  
3. Operator may disable drives or reinitialize for the next task cycle.  

---

## 3. Data Flow Summary

```plaintext
Operator (Web UI)
      ↓
   React Frontend
      ↓   ↑
   Node.js Server  ←→  TwinCAT PLC
      ↓
   Servo Drives (X/Y/Z Axes)
```

- Commands: Start, Stop, Feedrate Override, Mode Selection  
- Feedback: Axis positions, fault status, NC line number, completion status  

This continuous data exchange ensures sub‑second responsiveness between user inputs and physical machine motion.

---

## 4. Key Advantages

- **Real-time synchronization:** Sub-50 ms loop between UI and PLC.  
- **Full visibility:** Operators monitor all axis parameters remotely.  
- **Flexible control:** Switch between manual and automatic modes without redeployment.  
- **Safe operation:** Layered safety logic prevents mechanical or human error impact.  

---
## 5.Contact

📧 [nmnhat0508@gmail.com](mailto:nmnhat0508@gmail.com)  
🔗 [LinkedIn](https://www.linkedin.com/in/minhnhatnguyen0508/)

---

> _“A well-orchestrated control loop turns motion into precision.”_
