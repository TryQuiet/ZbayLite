import main from './generateRootCertificate'

describe('Certificates', () => {
  it('rootCA', () => {
    const aaa = main()


    expect(aaa).toEqual('aaa')
  })
})