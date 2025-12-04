import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestMon } from './test-mon';

describe('TestMon', () => {
  let component: TestMon;
  let fixture: ComponentFixture<TestMon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestMon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestMon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
