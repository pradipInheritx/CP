type SetsProps = {
    setName: string;
    sequence: string
}
type AlbumProps = {
    albumName: string;
    albumImageUrl: string;
    albumVideoUrl: string;
    setQuantity: number;
}

type CardProps = {
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
