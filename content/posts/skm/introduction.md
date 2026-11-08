+++
title = "The Dependent Combinator Calculus (DCC): Decidability in Extensional Type Theory"
date = "2026-11-08"
#dateFormat = "2006-01-02"
author = "Lexi Aiello"
authorTwitter = "lexzaiello"
cover = ""
keywords = ["lambda calculus", "type theory", "combinatory logic", "SK combinators"]
tags = ["lambda calculus", "type theory", "combinatory logic", "SK combinators"]
description = "Dependently-typed combinator calculus."
+++

# Dependently-Typed Combinators

*This project is available on GitHub [here](https://github.com/lexzaiello/dcc) and the paper is available [here](http://lexzaiello.com/DCC/dcc_paper.pdf)*

Combinatory logics like the [SK and BCKI combinator calcului](https://en.wikipedia.org/wiki/Combinatory_logic) have been well-known for being a Turing-complete system of computation despite being quite small and having no variables. Their equations are as such:

\\[
\begin{aligned}
K x y &= x\\\
S x y z &= x z (y z)\\\
B x y z &= x (y z)\\\
C x y z &= x z y\\\
I &x = x
\end{aligned}
\\]

It has been established that the SK combinator calculus is [equivalent](https://api.semanticscholar.org/CorpusID:259298739) to the $\lambda$-calculus. Yet, there has been a persistent gap in identifying a combinatory logic capable of expressing dependent types as in [intuitionistic type theory](https://en.wikipedia.org/wiki/Intuitionistic_type_theory). The $\lambda$-calculus can easily express dependent types due to the Curry-Horward isomoprhism. We simply type the lambda expression $\lambda x : A.M$ with a binder $\Pi x : A, B$ instead of with an arrow. However, combinatory logics do not have binders, nor anything resembling a canonical inhabitant of the logical proposition $\forall x \in A, P(x)$.

Some [progress](https://drops.dagstuhl.de/storage/00lipics/lipics-vol269-types2022/LIPIcs.TYPES.2022.10/LIPIcs.TYPES.2022.10.pdf) has been made towards dependently-typed SK combinators, but problems remain: the types are quite large; quantification is not internalized in the syntax; several constructions are required to represent the types of $S$ and $K$ which serve no other purpose; and types become even more prohibitively large when type quantification is internalized in the syntax. Hence, the gap remains.

## The Dependent Combinator Calculus (DCC)

I am happy to report that through my work on dependently-typed combinatory logic over the last 1.5 years, I have closed this gap. In my [paper](http://lexzaiello.com/DCC/dcc_paper.pdf), I identify the simply-typed [categorical combinators](https://www.sciencedirect.com/science/article/pii/0167642387900207) as an ideal candidate to extend to dependent types. I also proved that this calculus has a natural restriction to [affine logic](https://en.wikipedia.org/wiki/Linear_logic) which enables extensional equality reflection as in [extensional type theory](https://ncatlab.org/nlab/show/extensional+type+theory). I call my construction of dependently-typed, affine categorical combinators the Dependent Combinator Calculus (DCC). DCC has a working type-checker, decidable type-checking, and formal proofs of consistency, preservation, progress, and equality reflection (all as computable definitions), all written in Lean 4.

### DCC is based on Categorical Combinators

DCC is based on Curien's [categorical combinators](https://www.sciencedirect.com/science/article/pii/S001999588680047X), rather than SK or BCKI. I believe this was the ideal choice, since categorical combiantors are a literal interpretation of the [categorical semantics ((locally) cartesian closed categories)](https://math.mcgill.ca/rags/LCCC/LCCC.pdf) of the $\lambda$-calculus. Hence, unlike SK or BCKI which lack an obvious inhabitant of $\forall x \in A, P(x)$, it is quite obvious in DCC:

\\[
(\Lambda\ A\ B\ x) y z \rightarrow_{\beta} x (,B\ y\ z)
\\]

\\[
\frac{
A : \text{Sort } u \qquad B : A \rightarrow \text{Sort } v \qquad x : \Pi (x : \Sigma (x : A), B x), C x
}{
(\Lambda\ A\ B\ x) : \Pi (x : A) \Pi (y : B x), C (,B\ x y)
}
\\]

The curry combinator \(\Lambda\) is the familiar introduction rule for \(\Sigma\). And it should be familiar that \(\Sigma\)-types naturally encode telescope contexts. Hence, it is fair to conclude \(\Lambda\) is the combinatory equivalent of the dependent \(\lambda\)-binder.

DCC also uses affine logic, which was a natural extension of the categorical combinators. The rule $\langle M, N \rangle x \rightarrow_{\beta} (M x, N x)$ in categorical combinators can be viewed as the combinatory equivalent of application under $\lambda$-binders. In DCC, we restrict it like such:

\\[
(\langle , \rangle C\ M\ N) (\\&\ x) \rightarrow_{\beta} (,(C x)\ (M x)\ (N x (M x)))
\\]

By doing so, we make context duplication dependent, and $\beta$-reduction provably terminating. In my primary result, I show that this induces decidable type-checking and extensional equality reflection, meaning this holds:

\\[
\frac{e : (=A\ x\ y)}{x \equiv y}
\\]

That is, propositional equality induces definitional equality as in extensional type theory. I believe this is a somewhat foundational result, and it is only possible due to the natural affine restriction of categorical combinators.

### Lean 4 can be compiled to DCC

A subset of Lean 4 can be compiled to DCC. The compilation is extremely simple due to the close correspondence between DCC and locally cartesian closed categories. Here is the dependent identity function's compilation:

```lean
#eval Std.format (dcc_compile (fun (α : Type) (x : α) => x))
/-
Messages here:
10:0:
((Λ 𝟙 (`𝟙 (Sort 1)) (Λ (Σ 𝟙 (`𝟙 (Sort 1))) (Snd (`𝟙 (Sort 1))) (Snd (Snd (`𝟙 (Sort 1)))))) ∗)
-/
```

And it type-checks like such:

```lean
#eval (·.fst) <$> Expr.infer (dcc_compile (fun (α : Type) (x : α) => x))
#eval (·.fst) <$> Expr.infer (dcc_compile ((fun (α : Prop) (x : α) => x) True True.intro))
/-
Messages here:
12:0:
Except.ok (DCC
 ((Π (`𝟙 (Sort 1))
     (Λ 𝟙 (`𝟙 (Sort 1))
        (Π (Snd (`𝟙 (Sort 1)))
           (Λ (Σ 𝟙 (`𝟙 (Sort 1))) (Snd (`𝟙 (Sort 1))) (∘ (Snd (`𝟙 (Sort 1))) (Fst (Snd (`𝟙 (Sort 1)))))))))
  ∗))
Messages below:
13:0:
Except.ok (DCC 𝟙)
-/
```

### Comparison to other combinatory logics

I suffered through several attempts at dependently-typed combinatory logic with SK combinators and BCKI. None were successful. Types were prohibitively large and it was impossible to use. Much the opposite is true in DCC. I believe this is due to the canonical correspondence between Curien's categorical combinators, which DCC is an extension of, and cartesian closed categories. DCC can be viewed as merely an extension of them to locally closed cartesian categories. This induces an intuitive procedure for compiling the Calculus of Constructions to it, and DCC's restriction to affine logic induces decidable extensional type theory.

If you would like to read more, see my [paper](http://lexzaiello.com/DCC/dcc_paper.pdf) and the [GitHub repository](https://github.com/lexzaiello/DCC) for more. We aim to submit the paper for publication soon.
