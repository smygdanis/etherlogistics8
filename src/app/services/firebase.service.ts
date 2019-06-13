import { Offer } from "app/models/offer.model";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import {
    AngularFirestore,
    AngularFirestoreCollection,
    AngularFirestoreDocument
} from "@angular/fire/firestore";

@Injectable({
    providedIn: "root"
})
export class FirebaseService {
    private offersCollection: AngularFirestoreCollection<Offer>;
    private offerDoc: AngularFirestoreDocument<Offer>;

    constructor(private afs: AngularFirestore) {
        this.offersCollection = afs.collection<Offer>("offers");
    }
    // / constructor

    getCompany(): Observable<any> {
        return this.afs.collection("mycompany").valueChanges();
    }

    getBanks(): Observable<any> {
        return this.afs
            .collection("mycompany")
            .doc("mycompanydetails")
            .collection("banks")
            .valueChanges();
    }

    getContactsByCompany(start, end, tempcompany): Observable<any> {
        return this.afs
            .collection("contacts", ref =>
                ref
                    .where("contcompany", "==", tempcompany)
                    .orderBy("contsurname")
                    .limit(5)
                    .startAt(start)
                    .endAt(end)
            )
            .valueChanges();
    }

    getCompanies(start, end): Observable<any> {
        return this.afs
            .collection("companies", ref =>
                ref
                    .orderBy("companyname")
                    .limit(5)
                    .startAt(start)
                    .endAt(end)
            )
            .valueChanges();
    }

    addOffer(item): void {
        console.log("add ofer");
        this.offersCollection.add(item);
    }

    getOffer(key): Observable<Offer> {
        console.log("get offer");
        this.offerDoc = this.afs.doc<Offer>("offers/" + key);
        const offertoReturn = this.offerDoc.valueChanges();
        return offertoReturn;
    }
}
