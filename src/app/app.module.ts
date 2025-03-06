import { Compiler, CompilerFactory, COMPILER_OPTIONS } from '@angular/core';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { HeadloginComponent } from './headlogin/headlogin.component';
import { EmploginComponent } from './emplogin/emplogin.component';
import { CapitalizePipe } from './capitalize.pipe';
import { JitCompilerFactory } from '@angular/platform-browser-dynamic';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { TaskUpdateService } from './task-update.service';
import { LoginComponent } from './login/login.component';
@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    HeadloginComponent,
    EmploginComponent,
    CapitalizePipe,
    LoginComponent, 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatIconModule,
  ],
  providers: [
    { provide: COMPILER_OPTIONS, useValue: {}, multi: true },
    {
      provide: CompilerFactory,
      useClass: JitCompilerFactory,
      deps: [COMPILER_OPTIONS],
    },
    { provide: Compiler, useFactory: createCompiler, deps: [CompilerFactory] },
    TaskUpdateService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
export function createCompiler(compilerFactory: CompilerFactory) {
  return compilerFactory.createCompiler();
}
