import { Injectable } from '@angular/core';
import { Image, ImageCharger, TexteCharger } from '../../../../common/image';
import { Trace } from 'Trace';

const REGEXEXTENSION = ".svg$";
const REGEXSVG = "^(<svg)[^]*(svg>)$";
const DIV = "div";
const EXTENSION = "LE FICHIER N'A PAS LA BONNE EXTENSION";
const PROBLEME = "LE FICHIER NE PEUT PAS ETRE CHARGER, Veuillez verifier le contenu du fichier svg. Il faut absoluement que le fichier commence par '<svg ...' et finisse par '... svg>'";
const SVG = "svg";
const HEIGHT = "height";
const WIDTH = "width";
const FILL = "fill";
const RECT = "rect";
const TEXT = "text";
const VIDE = "";
const XTEXTE = "x";
const YTEXTE = "y";
const FONTFAMILY = "font-family";
const TEXTANCHOR = "text-anchor";
const FONTSIZE = "font-size";
const FONTWEIGHT = "font-weight";
const FONTSTYLE = "font-style";
const PATH = "path";
const TRACE = "d";
const STROKEWIDTH = "stroke-width";
const STROKE = "stroke";
const TRACEDEFAUT = "M  0 L 0 0 0";
const COULEURDEFAUT = "#000000";
const TSPAN = "tspan";

@Injectable({
  providedIn: 'root'
})
export class ChargementDataService {

  public imageCharger: ImageCharger;
  constructor() {
    this.imageCharger = {} as ImageCharger;
  }

  setImage(image: Image): ImageCharger {
    this.getData(image);
    this.getPath(image);
    this.getCouleur(image);
    this.getTexte(image);
    return this.imageCharger
  }

  getData(image: Image) {
    const div = document.createElement(DIV);
    div.innerHTML = `${image.svg}`;
    let hauteur;
    let largeur;
    for (let i = 0; i < div.querySelectorAll(SVG)[0].attributes.length; i++) {
      switch (div.querySelectorAll(SVG)[0].attributes[i].nodeName) {
        case HEIGHT:
          hauteur = div.querySelectorAll(SVG)[0].attributes[i].nodeValue;
          break;
        case WIDTH:
          largeur = div.querySelectorAll(SVG)[0].attributes[i].nodeValue;
          break;
      }
    }
    this.imageCharger.hauteur = hauteur === undefined || hauteur === null ? VIDE : hauteur;
    this.imageCharger.largeur = largeur === undefined || largeur === null ? VIDE : largeur;

  }
  getCouleur(image: Image) {
    const div = document.createElement(DIV);
    div.innerHTML = `${image.svg}`;
    let couleur;
    for (let i = 0; i < div.querySelectorAll(RECT)[0].attributes.length; i++) {
      switch (div.querySelectorAll(RECT)[0].attributes[i].nodeName) {
        case FILL:
          couleur = div.querySelectorAll(RECT)[0].attributes[i].nodeValue;
      }
    }
    this.imageCharger.couleur = couleur === undefined || couleur === null ? VIDE : couleur;
  }

  getTexte(image: Image) {
    const div = document.createElement(DIV);
    div.innerHTML = `${image.svg}`;
    let x;
    let y;
    let fill;
    let family;
    let anchor;
    let size;
    let weight;
    let style;
    let texte;
    let texteArray = new Array<TexteCharger>();
    for(let i=0; i<div.querySelectorAll(TSPAN).length;i++){
    }
    for (let i = 0; i < div.querySelectorAll(TEXT).length; i++) {
      for (let k = 1; k < div.querySelectorAll(TSPAN).length; k++) {
        for (let j = 0; j < div.querySelectorAll(TSPAN)[k].children.length; j++) {
          for(let l=0; l<div.querySelectorAll(TSPAN)[k].children[j].attributes.length; l++){
          switch (div.querySelectorAll(TSPAN)[k].children[j].attributes[l].nodeName) {
            case XTEXTE:
              x = div.querySelectorAll(TSPAN)[k].children[j].attributes[l].nodeValue;
              break;

            case YTEXTE:
              y = div.querySelectorAll(TSPAN)[k].children[j].attributes[l].nodeValue;
              break;

            case FILL:
              fill = div.querySelectorAll(TSPAN)[k].children[j].attributes[l].nodeValue;
              break;

            case FONTFAMILY:
              family = div.querySelectorAll(TSPAN)[k].children[j].attributes[l].nodeValue;
              break;

            case TEXTANCHOR:
              anchor = div.querySelectorAll(TSPAN)[k].children[j].attributes[l].nodeValue;
              break;

            case FONTSIZE:
              size = div.querySelectorAll(TSPAN)[k].children[j].attributes[l].nodeValue;
              break;

            case FONTWEIGHT:
              weight = div.querySelectorAll(TSPAN)[k].children[j].attributes[l].nodeValue;
              break;

            case FONTSTYLE:
              style = div.querySelectorAll(TSPAN)[k].children[j].attributes[l].nodeValue;
              break;
          }
        }
        texte = div.querySelectorAll(TSPAN)[k].children[j].innerHTML;
        x = x === undefined || x === null ? VIDE : x;
        y = y === undefined || y === null ? VIDE : y;
        fill = fill === undefined || fill === null ? VIDE : fill;
        family = family === undefined || family === null ? VIDE : family;
        anchor = anchor === undefined || anchor === null ? VIDE : anchor;
        size = size === undefined || size === null ? VIDE : size;
        weight = weight === undefined || weight === null ? VIDE : weight;
        style = style === undefined || style === null ? VIDE : style;
        texte = texte === undefined || texte === null ? VIDE : texte;

        texteArray.push({
          x,
          y,
          fill,
          family,
          anchor,
          size,
          weight,
          style,
          texte,
        });
        }
      }
    }
    this.imageCharger.texte = texteArray;
  }

  getPath(image: Image) {
    const div = document.createElement(DIV);
    div.innerHTML = `${image.svg}`;
    let trace = new Array<Trace>();
    let couleurP;
    let epaisseur;
    let couleurS;
    let instr;
    for (let i = 0; i < div.querySelectorAll(PATH).length; i++) {
      for (let j = 0; j < div.querySelectorAll(PATH)[i].attributes.length; j++) {
        switch (div.querySelectorAll(PATH)[i].attributes[j].nodeName) {
          case FILL:
            couleurP = div.querySelectorAll(PATH)[i].attributes[j].nodeValue;
            break;
          case STROKEWIDTH:
            epaisseur = div.querySelectorAll(PATH)[i].attributes[j].nodeValue;
            break;
          case STROKE:
            couleurS = div.querySelectorAll(PATH)[i].attributes[j].nodeValue;
            break;
          case TRACE:
            instr = div.querySelectorAll(PATH)[i].attributes[j].nodeValue;
            break;
        }
      }
      epaisseur = epaisseur === undefined || epaisseur === null ? 1 : epaisseur;
      couleurP = couleurP === undefined || couleurP === null ? COULEURDEFAUT : couleurP;
      couleurS = couleurS === undefined || couleurS === null ? COULEURDEFAUT : couleurS;
      instr = instr === undefined || instr === null ? TRACEDEFAUT : instr;
      const traceCourrante = new Trace(+epaisseur, couleurP, couleurS);
      traceCourrante.instr = instr;
      trace.push(traceCourrante);
    }
    this.imageCharger.trace = trace;
  }

  verificationExtension(titre: string): boolean {
    if (titre.match(REGEXEXTENSION)) {
      return true
    } else {
      alert(EXTENSION);
      return false
    }
  }

  verificationContenu(svg: string): boolean {
    if (svg.match(REGEXSVG)) {
      return true
    } else {
      alert(PROBLEME);
      return false
    }
  }

}
