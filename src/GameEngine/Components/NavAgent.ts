import { Component } from "./Component";
import { IRenderableGizmo } from "../Core/Interfaces/IRenderableGizmo";

// export class NavAgent extends Component implements IRenderableGizmo {

//     public start(): void {

//     }

//     private renderAstar(): void {
//         if (!this.ready) {
//             return;
//         }

//         this.canvasContext.beginPath();

//         let start = true;
//         for (let nodePos of this.path) {
//             if (start) {
//                 start = false;
//                 this.canvasContext.moveTo(nodePos.x, nodePos.y);
//                 continue;
//             }

//             this.canvasContext.lineTo(nodePos.x, nodePos.y);
            
//         }
       
//         this.canvasContext.strokeStyle = Color.Orange;
//         this.canvasContext.stroke();
//     }

// }