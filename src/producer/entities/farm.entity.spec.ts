import { Farm } from "./farm.entity";

describe('farm entity behavior', () => {
  it('should be defined', () => {
    const farm = Farm.create(
      'Happy Farm',
      'City A',
      'State X',
      1000,
      8000,
      200
    );
    expect(farm).toBeDefined();
  })

  it('should not be possible to create an farm when sum of cultivable area and vegetation area exceed the total area', async () => {
    const farm =  Farm.create(
      'Happy Farm',
      'City A',
      'State X',
      1000,
      8000,
      400
    );
    expect(() => farm.checkArea()).toThrow(new Error("The sum of cultivable area and vegetation area cannot exceed the total area of the farm"));
  })
});