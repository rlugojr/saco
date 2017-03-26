process.env.NODE_ENV = 'test';

import * as os from 'os';
import * as path from 'path';
import { ServerOptions } from '../src/ServerOptions';
import { Server } from '../src/Server';

let chai = require('chai');
var expect = chai.expect;
let chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);

const angularCliDemoPath = path.join(__dirname, '../../examples/angular-cli');
const vueCliDemoPath = path.join(__dirname, '../../examples/webpack-vue-cli');
const TESTS_PORT = 3028;

describe('testing basic CRUD operations', () => {

    it('test options construction', (done) => {
        let options: ServerOptions = { folder: angularCliDemoPath, port: TESTS_PORT, workers: 999, maxAge: 90 };
        let server: Server = new Server(options);
        expect(server.options.file).to.be.a('string').and.equal('index.html');
        expect(server.options.port).to.be.a('number').and.equal(TESTS_PORT);
        expect(server.options.dateformat).to.be.a('string').and.equal('GMT:HH:MM:ss dd-mmm-yy Z');
        expect(server.options.verbose).to.be.a('boolean').and.equal(false);
        expect(server.options.workers).to.be.a('number').and.equal(os.cpus().length);
        expect(server.options.maxAge).to.be.a('number').and.equal(90);
        expect(server.options.folder).to.be.a('string').and.equal(angularCliDemoPath);
        done();
    });

    it('test default options', (done) => {
        let options: ServerOptions = { folder: 'dist' };
        let server: Server = new Server(options);
        expect(server.options.file).to.be.a('string').and.equal('index.html');
        expect(server.options.port).to.be.a('number').and.equal(4200);
        expect(server.options.dateformat).to.be.a('string').and.equal('GMT:HH:MM:ss dd-mmm-yy Z');
        expect(server.options.verbose).to.be.a('boolean').and.equal(false);
        expect(server.options.workers).to.be.a('number').and.equal(os.cpus().length);
        expect(server.options.maxAge).to.be.a('number').and.equal(43200000);
        expect(server.options.folder).to.be.a('string').and.equal('dist');
        done();
    });

    // test disabled because of inability to test clusters
    xit('should launch angular-cli example', (done) => {
        let options: ServerOptions = { folder: angularCliDemoPath, port: TESTS_PORT, workers: 1 };
        let server: Server = new Server(options);
        server.start().then(() => {
            chai.request('localhost:' + options.port).get('/').then(res => {
                res.should.have.status(200);
                server.stop().then(() => {
                    done();
                });
            });
        });
    });

    // test disabled because of inability to test clusters
    xit('should launch webpack-vue-cli example', (done) => {
        let options: ServerOptions = { folder: vueCliDemoPath, port: TESTS_PORT, workers: 1 };
        let server: Server = new Server(options);
        server.start().then(() => {
            chai.request('localhost:' + options.port).get('/').then(res => {
                res.should.have.status(200);
                server.stop().then(() => {
                    done();
                });
            });
        });
    });

});