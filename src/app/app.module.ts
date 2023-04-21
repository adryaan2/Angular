import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MeccslistaComponent } from './meccslista/meccslista.component';
import { FogadasComponent } from './fogadas/fogadas.component';
import { TabellaComponent } from './tabella/tabella.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MeccslistaComponent,
    FogadasComponent,
    TabellaComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
