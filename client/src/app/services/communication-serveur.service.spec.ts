import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommunicationServeurService } from './communication-serveur.service';
import { Image } from '../../../../common/image';
import { Subject } from 'rxjs';

describe('CommunicationServeurService', () => {

  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [CommunicationServeurService],

  }));

  it('should be created', () => {
    const service: CommunicationServeurService = TestBed.get(CommunicationServeurService);
    expect(service).toBeTruthy();
  });

  it('devrait set la nouvelle image', () => {
    const service: CommunicationServeurService = TestBed.get(CommunicationServeurService);
    const mockImage = {svg: "", titre: "Allo", etiquette: ["A", "B"], _id: "1", date: ""} as Image;
    service.setImageCharger(mockImage);
    expect(service.image).toBeDefined();
  });

  it("devrait retourner l'image precedement set", () => {
    const service: CommunicationServeurService = TestBed.get(CommunicationServeurService);
    service.image = new Subject<Image>();
    const mockImage = {svg: "", titre: "Allo", etiquette: ["A", "B"], _id: "1", date: ""} as Image;
    service.setImageCharger(mockImage);
    expect(service.getImage).toBeDefined();
  });

  it("devrait set imageString a la valeur rentrer", () => {
    const service: CommunicationServeurService = TestBed.get(CommunicationServeurService);
    const mockSvg = "String svg pour test";
    service.setEtGetImage(mockSvg);
    expect(service.imageString).toEqual(mockSvg);
  })
});
