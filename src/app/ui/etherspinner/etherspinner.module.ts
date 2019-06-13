import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EtherspinnerComponent } from './../../ui/etherspinner/etherspinner.component';



const routes = [
    {
        path     : 'help',
        component: EtherspinnerComponent
    }
];

@NgModule({
    declarations: [
        EtherspinnerComponent,

    ],
    imports     : [
        RouterModule.forChild(routes),

 
    ],
    exports     : [
        EtherspinnerComponent
    ]
})

export class EtherSpinnerModule
{
}
