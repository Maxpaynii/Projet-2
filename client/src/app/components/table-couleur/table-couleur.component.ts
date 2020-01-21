import { Component, ViewChild, ElementRef, HostListener, EventEmitter,  AfterViewInit, Output} from '@angular/core';

@Component({
  selector: 'app-table-couleur',
  templateUrl: './table-couleur.component.html',
  styleUrls: ['./table-couleur.component.scss'],
})
export class TableCouleurComponent implements AfterViewInit {
  @ViewChild('canvas', {static: false}) canvas: ElementRef;

  @Output()
  couleur: EventEmitter<string> = new EventEmitter();

  ctx: CanvasRenderingContext2D;
  mousedown: boolean = false;
  Hauteurchoisie: number;

  evt: MouseEvent = new MouseEvent('mouseup', window); //pour le tester les events de la souris
  ngAfterViewInit() {
    this.afficher();
  }

  afficher() {
    if (!this.ctx) {
      this.ctx = this.canvas.nativeElement.getContext('2d');
    }
    const largeur = this.canvas.nativeElement.width;
    const hauteur = this.canvas.nativeElement.height;

    this.ctx.clearRect(0, 0, largeur, hauteur);

    const gradient = this.ctx.createLinearGradient(0, 0, 0, hauteur);
    gradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
    gradient.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
    gradient.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
    gradient.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
    gradient.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
    gradient.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
    gradient.addColorStop(1, 'rgba(255, 0, 0, 1)');

    this.ctx.beginPath();
    this.ctx.rect(0, 0, largeur, hauteur);

    this.ctx.fillStyle = gradient;
    this.ctx.fill();
    this.ctx.closePath();

    if (this.Hauteurchoisie) {
      this.ctx.beginPath();
      this.ctx.strokeStyle = 'white';
      this.ctx.lineWidth = 5;
      this.ctx.rect(0, this.Hauteurchoisie - 5, largeur, 10);
      this.ctx.stroke();
      this.ctx.closePath();
    }
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(evt: MouseEvent) {
    this.mousedown = false;
  }

  onMouseDown(evt: MouseEvent) {
    this.mousedown = true;
    this.Hauteurchoisie = evt.offsetY;
    this.afficher();
    this.emetCouleur(evt.offsetX, evt.offsetY);
  }

  onMouseMove(evt: MouseEvent) {
    if (this.mousedown) {
      this.Hauteurchoisie = evt.offsetY;
      this.afficher();
      this.emetCouleur(evt.offsetX, evt.offsetY);
    }
  }

  emetCouleur(x: number, y: number) {
    const rgbaColor = this.getCouleurAPosition(x, y);
    this.couleur.emit(rgbaColor);
  }

  getCouleurAPosition(x: number, y: number) {
    const cordImage = this.ctx.getImageData(x, y, 1, 1).data;
    return ( 'rgba(' + cordImage[0] + ',' + cordImage[1] + ',' + cordImage[2] + ',1)');
  }
}
