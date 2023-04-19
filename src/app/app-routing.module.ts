import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MeccslistaComponent } from './meccslista/meccslista.component';
import { FogadasComponent } from './fogadas/fogadas.component';

const routes: Routes = [
  {
    path: "",
    component: MeccslistaComponent
  },
  {
    path: "fogadasok",
    component: FogadasComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
