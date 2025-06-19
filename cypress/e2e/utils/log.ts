export default function log(str: string) {
  cy.task('log', str); // node js process log
  cy.log(str); // cypress log - for the test runner
}
