import { FuseUtils } from '@fuse/utils';

export class Service
{

    servicebudget: number;
    servicecost: number;
    servicemonthcost: number;
    servicepercent: number;
    servicepercentage: boolean; 
    servicetype: string; 
    servicedesc: string;
    serviceonce: string; 
    servicephoto: string;

    servicename: string;
    serviceid: string;
    dateupdated: string;


  

    /**
     * Constructor
     *
     * @param service
     */
    constructor(service)
    {
        {
            this.serviceid = service.serviceid || FuseUtils.generateGUID();
            this.servicename = service.servicename || '';
            this.servicephoto = service.servicephoto || 'assets/images/avatars/profile.jpg';
            this.servicebudget = service.servicebudget || 0;
            this.servicecost = service.servicecost || 0;
            this.servicemonthcost = service.servicemonthcost || 0;
            this.servicepercentage = service.servicepercentage || false;
            this.servicepercent = service.servicepercent || 0;
            this.servicetype = service.servicetype || 'No Type';
            this.servicedesc = service.servicedesc || '';
            this.serviceonce = service.serviceonce || 'once';

        }
    }
}
