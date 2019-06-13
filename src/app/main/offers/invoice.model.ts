import { FuseUtils } from '@fuse/utils';

export class Invoice
{
    // company object
    companyname
    pliriseponymia
    compafm
    compdoy
    compdrastiritiotita
    compklados
    compaddress
    compcontactphone
    compemail
    comppoli
    comptk
    compwebsite
    compxora
    compclienttype
// oldclient newclient
    compcode
    // invoice num sto vtiger?
    compdescription

    // end of company object

    contact // tha to antigrafoume?
    company // tha to antigrafoume?
    invtempid // auto pairnei gia na to briskoume (eite bgei timologio eite oxi)
    invnum // auto tha pairnei kanonika, palia itan invoicid
    invoicedatesent
    invoicedateupdated
    invoicediscount
    invoicenotes
    invoicefpa // 24 i' allo h' 0 otan einai black pou to bazei o xristis
    invoiceoffers // eite ena tha baloume array edw gia na xei polla 
    invoicepaid // an plirwthike. pote tha to bazoume paid/partialy paid / postponed/canceled?
    invoiceposotopay // gt yparxei auto? ti diafora exei apo to invoicetotal? isws epeidi prin eixame installments mesa sto invoice
    invoiceposopaid // to xame mallon epeidi ta installments itan edw. me basi to invoiceposotopay ebgaze ypoloipo
    invoiceservices // array pou ta bazei sa section mesa gia kathe offer
    invoicesubtotal
    invoicesubttotalfpa
    invoicetitle
    invoicetotal


    offid: string;
    contname: string;
    contsurname: string;
    contphoto: string;
    contalias: string;
    contcompany: string;
    contjobtitle: string;
    contmainemail: string;
    contsecemail: string;
    contmobile: string;
    contworkphone: string;
    contsecphone: string;
    contfax: string;
    contaddress: string;
    conttk: string;
    contarea: string;
    contcity: string;
    contcountry: string;
    contdepartment: string;
    contklados: string;
    contlead: string;
    contwebsite: string;
    contdesc: string;
    contbirthday: string;

    /**
     * Constructor
     *
     * @param contact
     */
    constructor(contact)
    {
        {
            this.offid = contact.offid || FuseUtils.generateGUID();
            this.contname = contact.contname || '';
            this.contsurname = contact.contsurname || '';
            this.contphoto = contact.contphoto || 'assets/images/avatars/profile.jpg';
            this.contalias = contact.contalias || '';
            this.contcompany = contact.contcompany || '';
            this.contjobtitle = contact.contjobtitle || '';
            this.contmainemail = contact.contmainemail || '';
            this.contsecemail = contact.contsecemail || '';
            this.contmobile = contact.contmobile || '';
            this.contworkphone = contact.contworkphone || '';
            this.contsecphone = contact.contsecphone || '';
            this.contfax = contact.contfax || '';
            this.contaddress = contact.contaddress || '';
            this.conttk = contact.conttk || '';
            this.contarea = contact.contarea || '';
            this.contcity = contact.contcity || '';
            this.contcountry = contact.contcountry || '';
            this.contdepartment = contact.contdepartment || '';
            this.contklados = contact.contklados || '';
            this.contlead = contact.contlead || '';
            this.contwebsite = contact.contwebsite || '';
            this.contdesc = contact.contdesc || '';
            this.contbirthday = contact.contbirthday || '';
        }
    }
}
