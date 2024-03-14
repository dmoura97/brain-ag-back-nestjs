import { Producer } from "./producer.entity";

describe('producer entity behavior', () => {
  it('should be defined', () => {
    const producer = Producer.create(
      '44491828806',
      'John Doe',
    );
    expect(producer).toBeDefined();
  })

  it('should not be defined when invalid document', async () => {
    expect(() => Producer.create(
      'invalid-document',
      'John Doe',
    )).toThrow(new Error("Invalid document"));
  })
});