interface Sets {
    setName: string;
    sequence: string
}
interface Album {
    albumName: string;
    albumImageUrl: string;
    albumVideoUrl: string;
    setQunatity: number;
}

type Card = {
    albumId: string;
    setId: string;
    albumName: string;
    setName: string;
    cardName: string;
    cardType: string;
    quantity: number;
    totalQuantity: number;
    sno: string[];
    noOfCardHolders: number;
    cardStatus: boolean;
    cardImageUrl: any;
    cardVideoUrl: any;
}
