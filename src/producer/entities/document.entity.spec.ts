import { Document } from "./document.entiy";

test.each([
  "64653742000107",
  "44491828806",
  "79.654.635/0001-62"
])("should test valid documents", function(cpf: string) {
  expect(new Document(cpf)).toBeDefined();
});

test.each([
  "",
	undefined,
	null,
	"11111111111",
	"111",
	"11111111111111"
])("should test invalid documents", function(document: any) {
  expect(() => new Document(document)).toThrow(new Error('Invalid document'));
});