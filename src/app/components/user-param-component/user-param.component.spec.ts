import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserParamComponent } from './user-param.component';

describe('UserParamComponent', () => {
  let component: UserParamComponent;
  let fixture: ComponentFixture<UserParamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserParamComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserParamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
