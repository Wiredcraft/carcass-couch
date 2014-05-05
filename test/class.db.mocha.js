var debug = require('debug')('carcass:test');

var should = require('should');
var carcass = require('carcass');
var _ = carcass.highland;
var uid = require('uid2');
var lib = require('../');
var example = require('../example');

describe('Class / DB:', function() {

    var DB = lib.classes.CouchDB;

    before(function(done) {
        example.reload(done);
    });

    it('should be a class', function() {
        DB.should.be.type('function');
        (new DB()).should.be.type('object');
    });

    describe('An instance:', function() {

        var couch = example.singletons.couch;
        var db = null;

        before(function() {
            db = couch.getDB();
        });

        it('should be an object', function() {
            db.should.be.type('object');
        });

        it('should have an id', function() {
            db.should.have.property('id').with.type('function');
            db.id().should.be.type('string');
        });

        it('should be a config consumer', function() {
            db.should.have.property('configManager').with.type('function');
            db.should.have.property('configName').with.type('function');
            db.should.have.property('config').with.type('function');
        });

        it('should have a config manager', function() {
            db.configManager().should.equal(example);
        });

        it('should have a couch', function() {
            db.should.have.property('couch').with.type('function');
            db.couch().should.equal(couch);
        });

        it('can build a read stream', function() {
            db.should.have.property('streamRead').with.type('function');
            db.streamRead().should.be.type('object');
        });

        it('can build a save stream', function() {
            db.should.have.property('streamSave').with.type('function');
            db.streamSave().should.be.type('object');
        });

        it('can build a saveAndRead stream', function() {
            db.should.have.property('streamSaveAndRead').with.type('function');
            db.streamSaveAndRead().should.be.type('object');
        });

        it('can declare', function(done) {
            // Declare twice at the same time.
            var instance = null;
            should.not.exist(db.db());
            db.declare(function(err, _db) {
                _db.should.be.type('object');
                instance = _db;
                // done(err);
            }).should.equal(db);
            db.declare(function(err, _db) {
                _db.should.be.type('object');
                _db.should.equal(instance);
                done(err);
            }).should.equal(db);
        });

        it('can save', function(done) {
            var id = uid(7);
            db.save(id, {}, function(err, res) {
                res.should.have.property('ok', true);
                res.should.have.property('id', id);
                done(err);
            }).should.equal(db);
        });

        it('can save', function(done) {
            var id = uid(7);
            db.save(id, {}, function(err, res) {
                res.should.have.property('ok', true);
                res.should.have.property('id', id);
                done(err);
            }).should.equal(db);
        });

        it('can save and read', function(done) {
            var id = uid(7);
            db.save(id, {}, function(err) {
                if (err) return done(err);
                db.read(id, function(err, doc) {
                    doc.should.have.property('_id', id);
                    done(err);
                }).should.equal(db);
            }).should.equal(db);
        });

        it('can save and read', function(done) {
            var id = uid(7);
            db.save(id, {}, function(err) {
                if (err) return done(err);
                db.read(id, function(err, doc) {
                    doc.should.have.property('_id', id);
                    done(err);
                }).should.equal(db);
            }).should.equal(db);
        });

        it('can save and remove', function(done) {
            var id = uid(7);
            db.save(id, {}, function(err) {
                if (err) return done(err);
                db.remove(id, function(err, res) {
                    res.should.have.property('ok', true);
                    res.should.have.property('id', id);
                    done(err);
                }).should.equal(db);
            }).should.equal(db);
        });

        it('can save and remove', function(done) {
            var id = uid(7);
            db.save(id, {}, function(err) {
                if (err) return done(err);
                db.remove(id, function(err, res) {
                    res.should.have.property('ok', true);
                    res.should.have.property('id', id);
                    done(err);
                }).should.equal(db);
            }).should.equal(db);
        });

        it('can save and read with saveAndRead', function(done) {
            var id = uid(7);
            db.saveAndRead(id, {
                lorem: uid(7)
            }, function(err, doc) {
                // debug('doc', doc);
                doc.should.have.property('_id', id);
                done(err);
            }).should.equal(db);
        });

        it('can save and read with saveAndRead', function(done) {
            var id = uid(7);
            db.saveAndRead(id, {
                lorem: uid(7)
            }, function(err, doc) {
                // debug('doc', doc);
                doc.should.have.property('_id', id);
                done(err);
            }).should.equal(db);
        });

        it('can save and read with stream', function(done) {
            var id = uid(7);
            db.save(id, {}, function(err) {
                if (err) return done(err);
                _([id]).pipe(db.streamRead()).on('data', function(doc) {
                    doc.should.be.type('object').with.property('_id', id);
                    done();
                });
            }).should.equal(db);
        });

        it('can save and read with stream', function(done) {
            var id = uid(7);
            db.save(id, {}, function(err, res) {
                if (err) return done(err);
                _([res]).pipe(db.streamRead()).on('data', function(doc) {
                    doc.should.be.type('object').with.property('_id', id);
                    done();
                });
            }).should.equal(db);
        });

        it('can save and read with stream', function(done) {
            var id = uid(7);
            db.save(id, {}, function(err, res) {
                if (err) return done(err);
                _([{
                    id: res.id
                }]).pipe(db.streamRead()).on('data', function(doc) {
                    doc.should.be.type('object').with.property('_id', id);
                    done();
                });
            }).should.equal(db);
        });

        it('can save with stream and read with stream', function(done) {
            var id = uid(7);
            _([{
                id: id
            }]).pipe(db.streamSave()).pipe(db.streamRead()).on('data', function(doc) {
                doc.should.be.type('object').with.property('_id', id);
                done();
            });
        });

        it('can save with stream and read with stream', function(done) {
            var id = uid(7);
            _([{
                id: id
            }]).pipe(db.streamSave()).pipe(db.streamRead()).on('data', function(doc) {
                doc.should.be.type('object').with.property('_id', id);
                done();
            });
        });

        it('can save and read with a saveAndRead stream', function(done) {
            var id = uid(7);
            _([{
                id: id
            }]).pipe(db.streamSaveAndRead()).on('data', function(doc) {
                doc.should.be.type('object').with.property('_id', id);
                done();
            });
        });

        it('can save and read with a saveAndRead stream', function(done) {
            var id = uid(7);
            _([{
                id: id
            }]).pipe(db.streamSaveAndRead()).on('data', function(doc) {
                doc.should.be.type('object').with.property('_id', id);
                done();
            });
        });

        it('can destroy', function(done) {
            db.destroy(done).should.equal(db);
        });

    });

    describe('The lorem instance:', function() {

        var couch = example.singletons.couch;
        var db = null;

        before(function() {
            db = couch.getDB('lorem');
        });

        it('can declare', function(done) {
            should.not.exist(db.db());
            db.declare(function(err, _db) {
                _db.should.be.type('object');
                done(err);
            }).should.equal(db);
        });

        it('can save the views', function(done) {
            db.saveDesignDocs(function(err, res) {
                debug('res', res);
                done(err);
            }).should.equal(db);
        });

        it('can save', function(done) {
            var id = uid(7);
            db.save(id, {
                something: 'a'
            }, function(err, res) {
                res.should.have.property('ok', true);
                res.should.have.property('id', id);
                done(err);
            }).should.equal(db);
        });

        it('can save', function(done) {
            var id = uid(7);
            db.save(id, {
                something: 'a'
            }, function(err, res) {
                res.should.have.property('ok', true);
                res.should.have.property('id', id);
                done(err);
            }).should.equal(db);
        });

        it('can save', function(done) {
            var id = uid(7);
            db.save(id, {
                something: 'b'
            }, function(err, res) {
                res.should.have.property('ok', true);
                res.should.have.property('id', id);
                done(err);
            }).should.equal(db);
        });

        it('can save', function(done) {
            var id = uid(7);
            db.save(id, {
                nothing: true
            }, function(err, res) {
                res.should.have.property('ok', true);
                res.should.have.property('id', id);
                done(err);
            }).should.equal(db);
        });

        it('can view', function(done) {
            db.view('find/bySomething', function(err, res) {
                res.should.be.instanceOf(Array).with.lengthOf(3);
                done(err);
            }).should.equal(db);
        });

        it('can view', function(done) {
            db.view('find/bySomething', {
                key: 'a'
            }, function(err, res) {
                res.should.be.instanceOf(Array).with.lengthOf(2);
                done(err);
            }).should.equal(db);
        });

        it('can view', function(done) {
            db.view('find/bySomething', {
                key: 'b'
            }, function(err, res) {
                res.should.be.instanceOf(Array).with.lengthOf(1);
                done(err);
            }).should.equal(db);
        });

        it('can view', function(done) {
            db.view('find/bySomething', {
                key: 'c'
            }, function(err, res) {
                res.should.be.instanceOf(Array).with.lengthOf(0);
                done(err);
            }).should.equal(db);
        });

        it('can view with stream', function(done) {
            _([{}]).pipe(db.streamView('find/bySomething')).pipe(_()).toArray(function(res) {
                res.should.be.instanceOf(Array).with.lengthOf(3);
                done();
            });
        });

        it('can view with stream (another syntax)', function(done) {
            var stream = db.streamView('find/bySomething');
            stream.write({});
            stream.end();
            _(stream).toArray(function(res) {
                res.should.be.instanceOf(Array).with.lengthOf(3);
                done();
            });
        });

        it('can view with stream', function(done) {
            _(['a']).pipe(db.streamView('find/bySomething')).pipe(_()).toArray(function(res) {
                res.should.be.instanceOf(Array).with.lengthOf(2);
                done();
            });
        });

        it('can view with stream (another syntax)', function(done) {
            _([{
                key: 'a'
            }]).pipe(db.streamView('find/bySomething')).pipe(_()).toArray(function(res) {
                res.should.be.instanceOf(Array).with.lengthOf(2);
                done();
            });
        });

        it('can view with stream (another syntax)', function(done) {
            var stream = db.streamView('find/bySomething');
            stream.write('a');
            stream.end();
            _(stream).toArray(function(res) {
                res.should.be.instanceOf(Array).with.lengthOf(2);
                done();
            });
        });

        it('can view with stream', function(done) {
            _(['b']).pipe(db.streamView('find/bySomething')).pipe(_()).toArray(function(res) {
                res.should.be.instanceOf(Array).with.lengthOf(1);
                done();
            });
        });

        it('can view with stream', function(done) {
            _(['c']).pipe(db.streamView('find/bySomething')).pipe(_()).toArray(function(res) {
                res.should.be.instanceOf(Array).with.lengthOf(0);
                done();
            });
        });

        it('can destroy', function(done) {
            db.destroy(done).should.equal(db);
        });

    });

    describe('An instance with a bad connection:', function() {

        var couch = null;
        var db = null;

        before(function() {
            couch = example.getConsumer('Couch', 'badCouch');
            db = couch.getDB('lorem');
        });

        it('can not declare', function(done) {
            should.not.exist(db.db());
            db.declare(function(err, _db) {
                should.exist(err);
                should.not.exist(_db);
                done();
            }).should.equal(db);
        });

        it('can not destroy', function(done) {
            db.destroy(function(err) {
                should.exist(err);
                done();
            }).should.equal(db);
        });

    });

});
