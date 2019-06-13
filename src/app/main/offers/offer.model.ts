import { FuseUtils } from '@fuse/utils';

export class Offer
{
    contactid: string; // tha to antigrafoume? id i' olokliro object?
    companyid: string; // tha to antigrafoume? id i' olokliro object?
    companyname: string;
    contname: string;
    id: string;
    offid: string; // auto pairnei gia na to briskoume (eite bgei timologio eite oxi)
    offtitle: string;
    offdatefirst: string;
    offdateupdated: string;

    offstatus: string;

    offnotes: string;

    offservices: any; // array pou ta bazei sa section mesa gia kathe offer
    offfpa: number; // 24 i' allo h' 0 otan einai black pou to bazei o xristis
    offdiscount: number;
    offsubtotal: number;
    offsubttotalfpa: number;
    offtotal: number;
    /**
     * Constructor
     *
     * @param contact
     */
    constructor(contact)
    {
        {
            this.contactid = contact.contactid || '';
            this.companyid = contact.companyid || '';
            this.companyname = contact.companyname || '';
            this.contname = contact.contname || '';
            this.id = contact.id || '';
            this.offid = contact.offid || FuseUtils.generateGUID();
            this.offtitle = contact.offtitle || '';
            this.offdatefirst = contact.offdatefirst || '';
            this.offdateupdated = contact.offdateupdated || '';
            this.offnotes = contact.offnotes || '';
            this.companyid = contact.companyid || '';
            this.offservices = contact.offservices || null;
            this.offfpa = contact.offfpa || 0;
            this.offdiscount = contact.offdiscount || 0;
            this.offsubtotal = contact.offsubtotal || 0;
            this.offsubttotalfpa = contact.offsubttotalfpa || 0;
            this.offtotal = contact.offtotal || 0;
            this.offstatus = contact.offstatus || 'No Status';
    
        }
    }
}
