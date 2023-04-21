import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MeccslistaComponent } from './meccslista/meccslista.component';
import { FogadasComponent } from './fogadas/fogadas.component';
import { TabellaComponent } from './tabella/tabella.component';

const routes: Routes = [
  {
    path: "",
    component: MeccslistaComponent
  },
  {
    path: "fogadasok",
    component: FogadasComponent
  },
  {
    path: "tabella",
    component: TabellaComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
