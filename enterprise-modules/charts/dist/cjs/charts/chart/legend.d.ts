import { Group } from "../scene/group";
import { FontStyle, FontWeight } from "../scene/shape/text";
import { LegendPosition } from "./chart";
import { Marker } from "./marker/marker";
import { Observable } from "../util/observable";
export interface LegendDatum {
    id: string;
    itemId: any;
    enabled: boolean;
    marker: {
        type?: new () => Marker;
        fill: string;
        stroke: string;
        fillOpacity: number;
        strokeOpacity: number;
    };
    label: {
        text: string;
    };
}
export declare enum Orientation {
    Vertical = 0,
    Horizontal = 1
}
export declare class Legend extends Observable {
    onLayoutChange?: () => void;
    readonly group: Group;
    private itemSelection;
    private oldSize;
    data: LegendDatum[];
    enabled: boolean;
    orientation: Orientation;
    position: LegendPosition;
    padding: number;
    itemPaddingX: number;
    itemPaddingY: number;
    markerType?: new () => Marker;
    markerPadding: number;
    markerSize: number;
    markerStrokeWidth: number;
    labelColor: string;
    labelFontStyle?: FontStyle;
    labelFontWeight?: FontWeight;
    labelFontSize: number;
    labelFontFamily: string;
    constructor();
    private _size;
    readonly size: Readonly<[number, number]>;
    /**
     * The method is given the desired size of the legend, which only serves as a hint.
     * The vertically oriented legend will take as much horizontal space as needed, but will
     * respect the height constraints, and the horizontal legend will take as much vertical
     * space as needed in an attempt not to exceed the given width.
     * After the layout is done, the {@link size} will contain the actual size of the legend.
     * If the actual size is not the same as the previous actual size, the legend will fire
     * the 'layoutChange' event to communicate that another layout is needed, and the above
     * process should be repeated.
     * @param width
     * @param height
     */
    performLayout(width: number, height: number): boolean;
    update(): void;
    datumForPoint(x: number, y: number): LegendDatum | undefined;
}
