import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { FlexLayoutModule } from "@angular/flex-layout";

import { FuseDirectivesModule } from "@fuse/directives/directives";
import { FusePipesModule } from "@fuse/pipes/pipes.module";
import { EtherSpinnerModule } from "./../app/ui/etherspinner/etherspinner.module";
import { ServicesModModule } from "./../app/shared/services-mod/services-mod.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        FlexLayoutModule,

        FuseDirectivesModule,
        FusePipesModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        FlexLayoutModule,

        FuseDirectivesModule,
        FusePipesModule,
        EtherSpinnerModule,
        ServicesModModule
    ]
})
export class FuseSharedModule {}
