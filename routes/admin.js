const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("categorias")
require("../models/Produto")
const Produto = mongoose.model("produtos")
require("../models/Materia")
const Materia = mongoose.model("materias")


router.get('/',(req, res) => {
    res.render("admin/index")
})

router.get("/materias", (req, res) => {
    Materia.find().sort({date_mp: 'desc'}).then((materias) => {
        res.render("admin/materias", {materias: materias})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as Matérias-Primas :(")
        res.redirect("/admin")
    })
})

router.get('/materias/add', (req, res) => {
    res.render("admin/addmaterias")
})

router.post("/materias/nova", (req, res) => {  
    const novaMateria = {
        cod_mp: req.body.cod_mp,
        desc_mp: req.body.desc_mp,  
        espessura_mp: req.body.espessura_mp,  
        comprimento_mp: req.body.comprimento_mp, 
        peso_mp: req.body.peso_mp,
        custo_mp: req.body.custo_mp 
    }
   
    new Materia(novaMateria).save().then(() => { 
        req.flash("success_msg", "Matéria-Prima cadastrada com sucesso!")
        res.redirect("/admin/materias")
           }).catch((err) => {
            req.flash("error_msg", "Houve um erro durante o salvamento da MP :(")
            res.redirect("/admin/materias/add")
           }) 
})
  

router.get('/categorias', (req, res) => {
    Categoria.find().sort({date: 'desc'}).then((categorias) => {
        res.render("admin/categorias", {categorias: categorias})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar a categoria.")
        res.redirect("/admin")
    })
})

router.get('/categorias/add', (req, res) => {
    res.render("admin/addcategorias")
})

router.post('/categorias/nova', (req, res) => {

var erros = []

if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
    erros.push({texto: "Nome inválido!"})
} 

if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
    erros.push({texto: "Slug inválido!"})
}

if(req.body.nome.length < 2){
    erros.push({texto: "Nome da categoria é muito pequeno!"})
}

if(erros.length > 0){
    res.render("admin/addcategorias", {erros: erros})
       }else{
        const novaCategortia = {
            nome: req.body.nome,
            slug: req.body.slug
        }
        new Categoria(novaCategortia).save().then(() => {
            req.flash("success_msg", "Categoria criada com sucesso!")
            res.redirect("/admin/categorias")
        }).catch((err) => {
            req.flash("error_msg", "Erro ao cadastrar categoria :( -  Tente novamente!")
            req.redirect("/admin")
        })
    }

})

router.get("/categorias/edit/:id", (req, res) => {
    Categoria.findOne({_id:req.params.id}).then((categoria) => {
        res.render("admin/editcategorias", {categoria: categoria})
    }).catch((err) => {
        req.flash("error_msg", "Esta categoria não existe")
        res.redirect("/admin/categorias")
    })

})

router.post("/categorias/edit", (req, res) => {
    Categoria.findOne({_id: req.body.id}).then((categoria) => {

        categoria.nome  = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(() => {
            req.flash("success_msg", "Categoria editada com sucesso!")
            res.redirect("/admin/categorias")
        }).catch((error) => {
            req.flash("error_msg", "Houve um erro interno ao salvar a edição da categoria! :(")
            res.redirect("/admin/categorias")
		})
		
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao editar a categoria")
        res.redirect("/admin/categorias")
	})
	
})

router.post("/categorias/deletar", (req, res) => {
    Categoria.remove({_id: req.body.id}).then(() => {
        req.flash("sucess_msg", "Categoria deletada com sucesso!")
        res.redirect("/admin/categorias")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao deletar a categoria. :(")
        res.redirect("/admin/categorias")
    })
})

router.get("/produtos", (req, res) => {
    Produto.find().populate("categoria").sort({date:'desc'}).then((produtos) => {
         res.render("admin/produtos", {produtos: produtos})   
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar os produtos :(")
        res.redirect("/admin/produtos")
    })
})

router.get("/produtos/add", (req, res) => {
    Categoria.find().then((categorias) => {
    Materia.find().then((materias) => {
        res.render("admin/addprodutos", {categorias: categorias, materias: materias})
   }).catch((err) => {
       req.flash("error_msg", "Houve um erro ao carregar o formulário! :(")
       res.redirect("/admin")
   })
   })   
})
router.post("/produtos/novo", (req, res) => {
 //   res.render("/admin/produtos/add")

    var erros = []

    if(req.body.categoria == "0"){
        erros.push({texto: "Selecione uma categoria"})
    }

    if(erros.length > 0){
        res.render("admin/produtos", {erros: erros})
    }else{  
        const novoProduto = {
            cod_produto: req.body.cod_produto,
            desc_produto: req.body.desc_produto,
            categoria: req.body.categoria,
            materia: req.body.materia,
            qtd_mp: req.body.qtd_mp,
            peso_produto: req.body.peso_produto,
            add_produto: req.body.add_produto,
            etapa1: req.body.etapa1,
            etapa2: req.body.etapa2,
            etapa3: req.body.etapa3,
            etapa4: req.body.etapa4,
            etapa5: req.body.etapa5,
            etapa6: req.body.etapa6,
            tempo1: req.body.tempo1,
            tempo2: req.body.tempo2,
            tempo3: req.body.tempo3,
            tempo4: req.body.tempo4,
            tempo5: req.body.tempo5,
            tempo6: req.body.tempo6
        }

        new Produto(novoProduto).save().then(() => {
            req.flash("success_msg", "Produto cadastrado com sucesso!")
            res.redirect("/admin/produtos")
        }).catch((err) => {   
            req.flash("error_msg", "Houve um erro durante o salvamento do produto :(")
            res.redirect("/admin/produtos/add")
        })
    }
})

router.get("/produtos/edit/:id", (req, res) => {

    Produto.findOne({_id:req.params.id}).then((produto) => {
        Categoria.find().then((categorias) => {
        Materia.find().then((materias) => {
            res.render("admin/editprodutos", {categorias: categorias, produto: produto, materias: materias})         
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao listar as categorias!")
            res.redirect("/admin/produtos")
        })          
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar o formulário de edição")
        res.redirect("/admin/produtos")
    })
    })
})

router.post("/produtos/edit", (req, res) =>{
    Produto.findOne({_id:req.body.id}).then((produto) => {

        produto.cod_produto = req.body.cod_produto
        produto.desc_produto = req.body.desc_produto
        produto.categoria = req.body.categoria
        produto.materia = req.body.materia
        produto.qtd_mp = req.body.qtd_mp
        produto.peso_produto= req.body.peso_produto
        produto.add_produto= req.body.add_produto
        produto.etapa1= req.body.etapa1
        produto.etapa2= req.body.etapa2
        produto.etapa3= req.body.etapa3
        produto.etapa4= req.body.etapa4
        produto.etapa5= req.body.etapa5
        produto.etapa6= req.body.etapa6
        produto.tempo1= req.body.tempo1
        produto.tempo2= req.body.tempo2
        produto.tempo3= req.body.tempo3
        produto.tempo4= req.body.tempo4
        produto.tempo5= req.body.tempo5
        produto.tempo6= req.body.tempo6

        produto.save().then(() => {
            req.flash("success_msg", "Produto editado com sucesso :)")
            res.redirect("/admin/produtos")
        }).catch((err) => {
            console.log(err)
            req.flash("error_msg", "Houve um erro interno ao editar o produto :(")
            res.redirect("/admin/produtos")
        })

    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao editar o produto :(")
        res.redirect("/admin/produtos")
    })
})
    

 router.post("/produtos/deletar", (req, res) => {
    Produto.remove({_id: req.body.id}).then(() => {
        req.flash("success_msg", "Produto deletado com sucesso :)")
        res.redirect("/admin/produtos")
    }).catch((err) => {
        req.flash("error_msg", "Houove um erro interno ao tentar deletar o produto, tente novamente :(")
        res.recirect("/admin/produtos")
    })
})

router.get("/produtos/deletar/:id", (req, res) => {
    Produto.remove({_id: req.params.id}).then(() => {
        req.flash("success_msg", "Produto deletado com sucesso :)")
        res.redirect("/admin/produtos")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro interno ao tentar deletar o porduto")
        res.redirect("/admin/produtos")
    })

})

router.get("/produtos/detalhes/:id", (req, res) => {
    Produto.findOne({_id:req.params.id}).then((produto) => {
        Categoria.find().then((categorias) => {
        Materia.find().then((materias) => {
            res.render("admin/detalhes", {categorias: categorias, produto: produto, materias: materias})         
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao listar as categorias!")
            res.redirect("/admin/produtos")
        })          
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar o formulário de edição")
        res.redirect("/admin/produtos")
    })
    })
}) 

router.get("/materias/edit/:id", (req, res) => {
    Materia.findOne({_id:req.params.id}).then((materia) => {
    res.render("admin/editmaterias", {materia: materia})
    }).catch((err) => {
        req.flash("error_msg", "Esta MP não existe!")
        res.redirect("/admin/materias")
    })
})

// Rota de edição de MP
router.post("/materias/edit", (req, res) =>{
    Materia.findOne({_id:req.body.id}).then((materia) => {

        materia.cod_mp = req.body.cod_mp,
        materia.desc_mp = req.body.desc_mp,
        materia.espessura = req.body.espessura,
        materia.comprimento_mp= req.body.comprimento_mp, 
        materia.peso_mp= req.body.peso_mp,
        materia.custo_mp= req.body.custo_mp

        materia.save().then(() => {
            req.flash("success_msg", "Matérira-Prima editado com sucesso :)")
            res.redirect("/admin/materias")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno ao editar a Matérira-Prima :(")
            res.redirect("/admin/materias")
        })

    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao editar a Matérira-Prima :(")
        res.redirect("/admin/materias")
    })
})

module.exports = router