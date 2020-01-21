import { Component, ViewChild, ElementRef, AfterViewInit, Input, Output,
  SimpleChanges, OnChanges, EventEmitter, HostListener} from '@angular/core';

@Component({
  selector: 'app-transparence-couleur',
  templateUrl: './transparence-couleur.component.html',
  styleUrls: ['./transparence-couleur.component.scss']
})
export class TransparenceCouleurComponent implements AfterViewInit, OnChanges {

  @Input() transparence: string;
  @Output() couleur: EventEmitter<string> = new EventEmitter(true);

  @ViewChild('canvas', {static: false}) canvas: ElementRef;
  couleurTemp: string;
  ctx: CanvasRenderingContext2D;
  evt: MouseEvent = new MouseEvent('mouseup', window);
  mousedown: boolean = false;
  PositionChoisie: { x: number; y: number };
  pos: any;

  ngAfterViewInit() {
    this.dessin();
  }

  dessin() {

    if (!this.ctx) {
      this.ctx = this.canvas.nativeElement.getContext('2d');
    }
    const largeur = this.canvas.nativeElement.width;
    const hauteur = this.canvas.nativeElement.height;

    this.ctx.fillStyle = this.transparence || 'rgba(255,255,255,1)';
    this.ctx.fillRect(0, 0, largeur, hauteur);

    const fondBlanc = this.ctx.createLinearGradient(0, 0, largeur, 0);
    fondBlanc.addColorStop(0, 'rgba(255,255,255,1)');
    fondBlanc.addColorStop(1, 'rgba(255,255,255,0)');

    this.ctx.fillStyle = fondBlanc;
    this.ctx.fillRect(0, 0, largeur, hauteur);

    const fondNoir = this.ctx.createLinearGradient(0, 0, 0, hauteur);
    fondNoir.addColorStop(0, 'rgba(0,0,0,0)');
    fondNoir.addColorStop(1, 'rgba(0,0,0,1)');

    this.ctx.fillStyle = fondNoir ;
    this.ctx.fillRect(0, 0, largeur, hauteur);

    if (this.PositionChoisie) { 
      this.ctx.strokeStyle = 'white';
      this.ctx.fillStyle = 'white';
      this.ctx.beginPath();
      this.ctx.arc(
        this.PositionChoisie.x,
        this.PositionChoisie.y,
        10,
        0,
        2 * Math.PI,
      );
      this.ctx.lineWidth = 5;
      this.ctx.stroke();
    }
  }

  ngOnChanges(changement: SimpleChanges) {
    if (changement['transparence']) {
      this.dessin();
      this.pos = this.PositionChoisie;
      if (this.pos) {
        this.couleur.emit(this.getColorAtPosition(this.pos.x, this.pos.y));
      }
    }
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(evt: MouseEvent) {
    this.mousedown = false;
  }

  onMouseDown(evt: MouseEvent) {
    this.mousedown = true;
    this.PositionChoisie = { x: evt.offsetX, y: evt.offsetY };
    this.dessin();
    this.couleur.emit(this.getColorAtPosition(evt.offsetX, evt.offsetY));
  }

  onMouseMove(evt: MouseEvent) {
    if (this.mousedown) {
      this.PositionChoisie = { x: evt.offsetX, y: evt.offsetY };
      this.dessin();
      this.emitColor(evt.offsetX, evt.offsetY);
    }
  }

  emitColor(x: number, y: number) {
    this.couleurTemp = this.getColorAtPosition(x, y);
    this.couleur.emit(this.couleurTemp);
  }

  getColorAtPosition(x: number, y: number) {
    const imageData = this.ctx.getImageData(x, y, 1, 1).data;
    return ( '#' + this.rgbAHex(imageData[0]) + this.rgbAHex(imageData[1])  + this.rgbAHex(imageData[2])
    );
  }
  rgbAHex(rgb: number) {
    let hex = Number(rgb).toString(16);
    if (hex.length < 2) {
        hex = '0' + hex;
    }
    return hex;
  }

}
